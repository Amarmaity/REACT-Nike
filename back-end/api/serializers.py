from django.db import transaction

from .models import User
from .models import (
    MasterCategory,
    SubCategory,
    Product,
    ProductImage,
    ProductVariant,
    ProductVariantImage,
)
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "role"]

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
        )
        user.set_unusable_password()
        user.save()
        return user



class MasterCategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = MasterCategory
        fields = ["id", "name", "slug", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "is_active", "created_at", "updated_at"]

    def validate(self, attrs):
        if not attrs.get("name"):
            raise serializers.ValidationError({"name": "Category name is required"})

        return attrs


class SubCategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    master_category_details = MasterCategorySerializer(
        source="master_category", read_only=True
    )

    class Meta:
        model = SubCategory
        fields = [
            "id",
            "master_category",
            "master_category_details",
            "name",
            "description",
            "image",
            "slug",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "master_category_details",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        master_category = attrs.get("master_category") or getattr(
            self.instance, "master_category", None
        )
        name = attrs.get("name", getattr(self.instance, "name", ""))
        description = attrs.get(
            "description", getattr(self.instance, "description", "")
        )

        if not master_category:
            raise serializers.ValidationError(
                {"master_category": "Parent category is required"}
            )

        if not str(name).strip():
            raise serializers.ValidationError({"name": "Subcategory name is required"})

        if not str(description).strip():
            raise serializers.ValidationError(
                {"description": "Description is required"}
            )

        if "name" in attrs:
            attrs["name"] = str(name).strip()

        if "description" in attrs:
            attrs["description"] = str(description).strip()

        return attrs


# ---------------------------
# Product Serializer
# ---------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "sort_order"]
        read_only_fields = ["id"]


class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ["id", "image", "sort_order"]
        read_only_fields = ["id"]


class ProductVariantSerializer(serializers.ModelSerializer):
    images = ProductVariantImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "title",
            "sku",
            "attributes",
            "price",
            "compare_at_price",
            "stock_quantity",
            "track_quantity",
            "is_active",
            "sort_order",
            "images",
        ]
        read_only_fields = ["id", "images"]

    def validate(self, attrs):
        price = attrs.get("price")
        compare_at_price = attrs.get("compare_at_price")
        attributes = attrs.get("attributes") or {}
        sku = (attrs.get("sku") or "").strip()

        if not sku:
            raise serializers.ValidationError({"sku": "Variant SKU is required"})

        if not attributes:
            raise serializers.ValidationError(
                {"attributes": "Variant attributes are required"}
            )

        if compare_at_price is not None and price is not None and compare_at_price < price:
            raise serializers.ValidationError(
                {
                    "compare_at_price": "Compare price must be greater than or equal to price"
                }
            )

        attrs["sku"] = sku
        return attrs


class ProductSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(
        source="product_type", choices=Product.PRODUCT_TYPE_CHOICES
    )
    featured = serializers.BooleanField(source="is_featured", required=False)
    slug = serializers.SlugField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    sku = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    base_sku = serializers.CharField(required=False, allow_blank=True)
    short_description = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    compare_at_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    gallery = ProductImageSerializer(source="gallery_images", many=True, read_only=True)
    variations = ProductVariantSerializer(source="variants", many=True, required=False)
    sub_category_details = SubCategorySerializer(source="sub_category", read_only=True)
    master_category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "type",
            "sub_category",
            "sub_category_details",
            "master_category",
            "name",
            "description",
            "short_description",
            "sku",
            "base_sku",
            "price",
            "compare_at_price",
            "image",
            "gallery",
            "slug",
            "featured",
            "track_quantity",
            "stock_quantity",
            "options",
            "variations",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "gallery",
            "sub_category_details",
            "master_category",
            "created_at",
            "updated_at",
        ]

    def get_master_category(self, obj):
        master_category = obj.sub_category.master_category
        return {
            "id": master_category.id,
            "name": master_category.name,
            "slug": master_category.slug,
        }

    def validate_options(self, options):
        normalized_options = []
        seen_names = set()

        for option in options or []:
            name = str(option.get("name", "")).strip()
            raw_values = option.get("values", [])

            if isinstance(raw_values, str):
                values = [value.strip() for value in raw_values.split(",") if value.strip()]
            else:
                values = [str(value).strip() for value in raw_values if str(value).strip()]

            normalized_name = name.lower()
            values = list(dict.fromkeys(values))

            if not name:
                raise serializers.ValidationError("Each option must have a name")

            if normalized_name in seen_names:
                raise serializers.ValidationError(
                    f"Duplicate option name found: {name}"
                )

            if not values:
                raise serializers.ValidationError(
                    f"{name} must contain at least one value"
                )

            seen_names.add(normalized_name)
            normalized_options.append({"name": name, "values": values})

        return normalized_options

    def _sku_in_use(self, sku):
        current_product = self.instance if isinstance(self.instance, Product) else None

        product_query = Product.objects.filter(sku=sku)
        variant_query = ProductVariant.objects.filter(sku=sku)

        if current_product:
            product_query = product_query.exclude(pk=current_product.pk)
            variant_query = variant_query.exclude(product=current_product)

        return product_query.exists() or variant_query.exists()

    def validate(self, attrs):
        product_type = attrs.get("product_type")
        variations = attrs.get("variants", [])
        options = attrs.get("options", [])
        price = attrs.get("price")
        compare_at_price = attrs.get("compare_at_price")
        sku = (attrs.get("sku") or "").strip() or None
        track_quantity = attrs.get("track_quantity", True)
        stock_quantity = attrs.get("stock_quantity")

        if not attrs.get("sub_category"):
            raise serializers.ValidationError(
                {"sub_category": "Sub category is required"}
            )

        if not attrs.get("name"):
            raise serializers.ValidationError({"name": "Name is required"})

        if not attrs.get("description"):
            raise serializers.ValidationError(
                {"description": "Description is required"}
            )

        if compare_at_price is not None and price is not None and compare_at_price < price:
            raise serializers.ValidationError(
                {
                    "compare_at_price": "Compare price must be greater than or equal to price"
                }
            )

        if product_type == "simple":
            if not sku:
                raise serializers.ValidationError({"sku": "SKU is required"})

            if self._sku_in_use(sku):
                raise serializers.ValidationError({"sku": "SKU must be unique"})

            if price is None:
                raise serializers.ValidationError({"price": "Price is required"})

            if track_quantity and stock_quantity is None:
                raise serializers.ValidationError(
                    {"stock_quantity": "Stock quantity is required when inventory is tracked"}
                )

            if variations:
                raise serializers.ValidationError(
                    {"variations": "Simple products cannot contain variations"}
                )

            attrs["sku"] = sku
            attrs["base_sku"] = ""
            attrs["options"] = []

        elif product_type == "variable":
            if not options:
                raise serializers.ValidationError(
                    {"options": "At least one option is required for variable products"}
                )

            if not variations:
                raise serializers.ValidationError(
                    {"variations": "At least one variation is required"}
                )

            option_names = {option["name"].strip().lower() for option in options}
            option_value_map = {
                option["name"].strip().lower(): {
                    str(value).strip() for value in option["values"]
                }
                for option in options
            }
            seen_variant_skus = set()
            seen_attribute_sets = set()

            for index, variation in enumerate(variations):
                variation_sku = (variation.get("sku") or "").strip()
                attributes = variation.get("attributes") or {}
                attribute_names = {str(key).strip().lower() for key in attributes.keys()}
                normalized_attributes = {
                    str(key).strip().lower(): str(value).strip()
                    for key, value in attributes.items()
                }
                attribute_key = tuple(sorted(normalized_attributes.items()))

                if not variation_sku:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {"sku": "Each variation must have a SKU"}
                            }
                        }
                    )

                if variation_sku in seen_variant_skus or self._sku_in_use(variation_sku):
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {"sku": "Variation SKU must be unique"}
                            }
                        }
                    )

                if attribute_names != option_names:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {
                                    "attributes": "Variation attributes must match the defined options"
                                }
                            }
                        }
                    )

                if attribute_key in seen_attribute_sets:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {
                                    "attributes": "Duplicate variation combination found"
                                }
                            }
                        }
                    )

                invalid_option_value = next(
                    (
                        option_name
                        for option_name, option_value in normalized_attributes.items()
                        if option_value not in option_value_map.get(option_name, set())
                    ),
                    None,
                )

                if invalid_option_value:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {
                                    "attributes": f"{invalid_option_value} contains a value outside the defined option values"
                                }
                            }
                        }
                    )

                seen_variant_skus.add(variation_sku)
                seen_attribute_sets.add(attribute_key)

            attrs["sku"] = None
            attrs["price"] = None
            attrs["compare_at_price"] = None
            attrs["stock_quantity"] = 0

        return attrs

    @transaction.atomic
    def _sync_gallery_images(self, product, request):
        gallery_images = request.FILES.getlist("gallery_images") if request else []

        if not gallery_images:
            return

        product.gallery_images.all().delete()

        for index, image in enumerate(gallery_images):
            ProductImage.objects.create(
                product=product,
                image=image,
                sort_order=index,
            )

    def _sync_variations(self, product, variations, request):
        existing_variants = {
            variant.sku: {
                "images": list(variant.images.all()),
                "attributes_key": tuple(
                    sorted(
                        (
                            str(key).strip().lower(),
                            str(value).strip(),
                        )
                        for key, value in (variant.attributes or {}).items()
                    )
                ),
            }
            for variant in product.variants.prefetch_related("images")
        }
        existing_variants_by_attributes = {
            value["attributes_key"]: value["images"]
            for value in existing_variants.values()
        }

        product.variants.all().delete()

        for variation_index, variation_data in enumerate(variations):
            variation = ProductVariant.objects.create(
                product=product,
                sort_order=variation_index,
                **variation_data,
            )
            attribute_key = tuple(
                sorted(
                    (
                        str(key).strip().lower(),
                        str(value).strip(),
                    )
                    for key, value in (variation.attributes or {}).items()
                )
            )

            uploaded_images = (
                request.FILES.getlist(f"variation_images_{variation_index}")
                if request
                else []
            )

            if uploaded_images:
                for image_index, image in enumerate(uploaded_images):
                    ProductVariantImage.objects.create(
                        variant=variation,
                        image=image,
                        sort_order=image_index,
                    )
                continue

            preserved_images = existing_variants.get(variation.sku, {}).get("images") or (
                existing_variants_by_attributes.get(attribute_key, [])
            )

            for image_index, existing_image in enumerate(
                preserved_images
            ):
                ProductVariantImage.objects.create(
                    variant=variation,
                    image=existing_image.image.name,
                    sort_order=image_index,
                )

    def create(self, validated_data):
        variations = validated_data.pop("variants", [])
        product = Product.objects.create(**validated_data)
        request = self.context.get("request")
        self._sync_gallery_images(product, request)
        self._sync_variations(product, variations, request)

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        variations = validated_data.pop("variants", None)
        request = self.context.get("request")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        self._sync_gallery_images(instance, request)

        if instance.product_type == "simple":
            instance.options = []
            instance.base_sku = ""
            instance.variants.all().delete()
            instance.save(update_fields=["options", "base_sku"])
        elif variations is not None:
            self._sync_variations(instance, variations, request)

        return instance
