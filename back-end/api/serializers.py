from django.db import transaction

from .models import User
from .models import (
    MasterCategory,
    SubCategory,
    Product,
    ProductImage,
    ProductVariant,
    ProductVariantImage,
    CustomerDetails,
)
from rest_framework import serializers


<<<<<<< Updated upstream
def normalize_attribute_items(attributes):
    return tuple(
        sorted(
            (
                str(key).strip().lower(),
                str(value).strip(),
            )
            for key, value in (attributes or {}).items()
        )
    )


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



=======
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



>>>>>>> Stashed changes
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
    id = serializers.IntegerField(required=False)
    sku = serializers.CharField(validators=[])
    removed_image_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        write_only=True,
        default=list,
    )
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
            "removed_image_ids",
            "images",
        ]
        read_only_fields = ["images"]

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
    tags = serializers.ListField(
        child=serializers.CharField(allow_blank=False),
        required=False,
        allow_empty=True,
        default=list,
    )
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    compare_at_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    removed_gallery_image_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        write_only=True,
        default=list,
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
            "tags",
            "sku",
            "base_sku",
            "price",
            "compare_at_price",
            "image",
            "removed_gallery_image_ids",
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

    def validate_tags(self, tags):
        normalized_tags = []
        seen_tags = set()

        for tag in tags or []:
            normalized_tag = str(tag).strip()

            if not normalized_tag:
                continue

            tag_key = normalized_tag.lower()
            if tag_key in seen_tags:
                continue

            seen_tags.add(tag_key)
            normalized_tags.append(normalized_tag)

        return normalized_tags

    def _sku_in_use(self, sku, allowed_variant_ids=None):
        current_product = self.instance if isinstance(self.instance, Product) else None
        allowed_variant_ids = set(allowed_variant_ids or [])

        product_query = Product.objects.filter(sku=sku)
        variant_query = ProductVariant.objects.filter(sku=sku)

        if current_product:
            product_query = product_query.exclude(pk=current_product.pk)

        if allowed_variant_ids:
            variant_query = variant_query.exclude(pk__in=allowed_variant_ids)

        return product_query.exists() or variant_query.exists()

    def validate(self, attrs):
        current_product = self.instance if isinstance(self.instance, Product) else None
        product_type = attrs.get(
            "product_type",
            getattr(current_product, "product_type", Product.PRODUCT_TYPE_CHOICES[0][0]),
        )
        variations = attrs.get("variants", [])
        options = attrs.get("options", [])
        price = attrs.get("price")
        compare_at_price = attrs.get("compare_at_price")
        sku = (attrs.get("sku") or "").strip() or None
        track_quantity = attrs.get("track_quantity", True)
        stock_quantity = attrs.get("stock_quantity")
        sub_category = attrs.get("sub_category", getattr(current_product, "sub_category", None))
        name = attrs.get("name", getattr(current_product, "name", ""))
        description = attrs.get("description", getattr(current_product, "description", ""))

        if not sub_category:
            raise serializers.ValidationError(
                {"sub_category": "Sub category is required"}
            )

        if not name:
            raise serializers.ValidationError({"name": "Name is required"})

        if not description:
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
            existing_variant_ids = (
                set(current_product.variants.values_list("id", flat=True))
                if current_product
                else set()
            )
            submitted_variant_ids = []
            seen_variant_ids = set()
            seen_variant_skus = set()
            seen_attribute_sets = set()

            for index, variation in enumerate(variations):
                variation_id = variation.get("id")

                if variation_id in [None, ""]:
                    continue

                if variation_id in seen_variant_ids:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {"id": "Duplicate variation reference found"}
                            }
                        }
                    )

                if not current_product or variation_id not in existing_variant_ids:
                    raise serializers.ValidationError(
                        {
                            "variations": {
                                index: {"id": "Variation does not belong to this product"}
                            }
                        }
                    )

                seen_variant_ids.add(variation_id)
                submitted_variant_ids.append(variation_id)

            allowed_variant_ids = set(submitted_variant_ids)

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

                if variation_sku in seen_variant_skus or self._sku_in_use(
                    variation_sku, allowed_variant_ids=allowed_variant_ids
                ):
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
    def _sync_gallery_images(self, product, request, removed_gallery_image_ids=None):
        gallery_images = request.FILES.getlist("gallery_images") if request else []
        removed_gallery_image_ids = removed_gallery_image_ids or []

        if removed_gallery_image_ids:
            product.gallery_images.filter(id__in=removed_gallery_image_ids).delete()

        existing_gallery_images = list(product.gallery_images.all())
        for index, existing_image in enumerate(existing_gallery_images):
            if existing_image.sort_order != index:
                existing_image.sort_order = index
                existing_image.save(update_fields=["sort_order"])

        if not gallery_images:
            return

        start_index = len(existing_gallery_images)

        for index, image in enumerate(gallery_images, start=start_index):
            ProductImage.objects.create(
                product=product,
                image=image,
                sort_order=index,
            )

    def _sync_variations(self, product, variations, request):
        existing_variants = {
            variant.id: variant
            for variant in product.variants.prefetch_related("images")
        }
        existing_variants_by_attributes = {
            normalize_attribute_items(variant.attributes): variant
            for variant in existing_variants.values()
        }
        retained_variant_ids = set()

        for variation_index, raw_variation_data in enumerate(variations):
            variation_data = {**raw_variation_data}
            variation_id = variation_data.pop("id", None)
            removed_image_ids = variation_data.pop("removed_image_ids", []) or []
            variation_data["sort_order"] = variation_index
            attribute_key = normalize_attribute_items(variation_data.get("attributes"))

            existing_variant = None

            if variation_id and variation_id in existing_variants:
                existing_variant = existing_variants[variation_id]
            else:
                matched_variant = existing_variants_by_attributes.get(attribute_key)
                if matched_variant and matched_variant.id not in retained_variant_ids:
                    existing_variant = matched_variant

            if existing_variant:
                for attr, value in variation_data.items():
                    setattr(existing_variant, attr, value)
                existing_variant.save()
                variation = existing_variant
            else:
                variation = ProductVariant.objects.create(
                    product=product,
                    **variation_data,
                )

            retained_variant_ids.add(variation.id)

            uploaded_images = (
                request.FILES.getlist(f"variation_images_{variation_index}")
                if request
                else []
            )

            if removed_image_ids:
                variation.images.filter(id__in=removed_image_ids).delete()

            existing_images = list(variation.images.all())
            for image_index, existing_image in enumerate(existing_images):
                if existing_image.sort_order != image_index:
                    existing_image.sort_order = image_index
                    existing_image.save(update_fields=["sort_order"])

            if uploaded_images:
                start_index = len(existing_images)
                for image_index, image in enumerate(uploaded_images, start=start_index):
                    ProductVariantImage.objects.create(
                        variant=variation,
                        image=image,
                        sort_order=image_index,
                    )

        product.variants.exclude(id__in=retained_variant_ids).delete()

    @transaction.atomic
    def create(self, validated_data):
        variations = validated_data.pop("variants", [])
        removed_gallery_image_ids = validated_data.pop("removed_gallery_image_ids", [])
        product = Product.objects.create(**validated_data)
        request = self.context.get("request")
        self._sync_gallery_images(
            product,
            request,
            removed_gallery_image_ids=removed_gallery_image_ids,
        )
        self._sync_variations(product, variations, request)

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        variations = validated_data.pop("variants", None)
        removed_gallery_image_ids = validated_data.pop("removed_gallery_image_ids", [])
        request = self.context.get("request")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        self._sync_gallery_images(
            instance,
            request,
            removed_gallery_image_ids=removed_gallery_image_ids,
        )

        if instance.product_type == "simple":
            instance.options = []
            instance.base_sku = ""
            instance.variants.all().delete()
            instance.save(update_fields=["options", "base_sku"])
        elif variations is not None:
            self._sync_variations(instance, variations, request)

        return instance



class CustomerDetailsSerializer (serializers.ModelSerializer):
    
    class Meta:
        model = CustomerDetails
        fields = '__all_'