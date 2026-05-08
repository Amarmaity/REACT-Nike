import json
import shutil
import tempfile
from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import (
    MasterCategory,
    Product,
    ProductImage,
    ProductVariant,
    ProductVariantImage,
    SubCategory,
    User,
)


def make_test_image(name):
    return SimpleUploadedFile(
        name,
        (
            b"GIF89a\x01\x00\x01\x00\x80\x00\x00"
            b"\x00\x00\x00\xff\xff\xff!\xf9\x04"
            b"\x01\x00\x00\x00\x00,\x00\x00\x00"
            b"\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
        ),
        content_type="image/gif",
    )


class VariableProductUpdateTests(TestCase):
    def setUp(self):
        self.media_dir = tempfile.mkdtemp(dir="C:\\tmp")
        self.media_override = override_settings(MEDIA_ROOT=self.media_dir)
        self.media_override.enable()

        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin-user",
            email="admin@example.com",
            role="admin",
            is_active=True,
            is_verified=True,
        )
        self.client.force_authenticate(user=self.admin_user)

        self.master_category = MasterCategory.objects.create(name="Women")
        self.sub_category = SubCategory.objects.create(
            master_category=self.master_category,
            name="Frock",
            description="Frock collection",
        )

        self.product = Product.objects.create(
            sub_category=self.sub_category,
            name="New Modern Frock",
            description="long description",
            short_description="testing short description",
            product_type="variable",
            base_sku="NEW-FROCK",
            tags=["women", "frock"],
            options=[
                {"name": "Size", "values": ["s"]},
                {"name": "Color", "values": ["green", "blue"]},
            ],
            is_active=True,
        )
        self.gallery_image_one = ProductImage.objects.create(
            product=self.product,
            image=make_test_image("gallery-original-1.gif"),
            sort_order=0,
        )
        self.gallery_image_two = ProductImage.objects.create(
            product=self.product,
            image=make_test_image("gallery-original-2.gif"),
            sort_order=1,
        )

        self.variant_one = ProductVariant.objects.create(
            product=self.product,
            title="Size: s / Color: green",
            sku="NEW-FROCK-S-GREEN",
            attributes={"Size": "s", "Color": "green"},
            price=Decimal("400.00"),
            compare_at_price=Decimal("500.00"),
            stock_quantity=10,
            track_quantity=True,
            is_active=True,
            sort_order=0,
        )
        self.variant_two = ProductVariant.objects.create(
            product=self.product,
            title="Size: s / Color: blue",
            sku="NEW-FROCK-S-BLUE",
            attributes={"Size": "s", "Color": "blue"},
            price=Decimal("420.00"),
            compare_at_price=Decimal("520.00"),
            stock_quantity=8,
            track_quantity=True,
            is_active=True,
            sort_order=1,
        )

        ProductVariantImage.objects.create(
            variant=self.variant_one,
            image=make_test_image("green-original.gif"),
            sort_order=0,
        )
        ProductVariantImage.objects.create(
            variant=self.variant_two,
            image=make_test_image("blue-original.gif"),
            sort_order=0,
        )

    def tearDown(self):
        self.media_override.disable()
        shutil.rmtree(self.media_dir, ignore_errors=True)

    def build_payload(self):
        return {
            "type": "variable",
            "sub_category": str(self.sub_category.id),
            "name": "New Modern Frock Updated",
            "short_description": "updated short description",
            "description": "updated long description",
            "slug": "",
            "featured": "false",
            "is_active": "true",
            "base_sku": "NEW-FROCK",
            "tags": json.dumps(["party wear", "summer", "women"]),
            "options": json.dumps(
                [
                    {"name": "Size", "values": ["s"]},
                    {"name": "Color", "values": ["green", "blue"]},
                ]
            ),
            "variations": json.dumps(
                [
                    {
                        "id": self.variant_one.id,
                        "title": "Size: s / Color: green",
                        "sku": "NEW-FROCK-S-GREEN",
                        "attributes": {"Size": "s", "Color": "green"},
                        "price": 450,
                        "compare_at_price": 550,
                        "stock_quantity": 12,
                        "track_quantity": True,
                        "is_active": True,
                    },
                    {
                        "id": self.variant_two.id,
                        "title": "Size: s / Color: blue",
                        "sku": "NEW-FROCK-S-BLUE",
                        "attributes": {"Size": "s", "Color": "blue"},
                        "price": 430,
                        "compare_at_price": 530,
                        "stock_quantity": 9,
                        "track_quantity": True,
                        "is_active": True,
                    },
                ]
            ),
        }

    def test_patch_allows_existing_variant_skus(self):
        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=self.build_payload(),
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        variant_ids = set(
            ProductVariant.objects.filter(product=self.product).values_list("id", flat=True)
        )
        self.assertEqual(variant_ids, {self.variant_one.id, self.variant_two.id})

        self.variant_one.refresh_from_db()
        self.variant_two.refresh_from_db()
        self.product.refresh_from_db()

        self.assertEqual(self.variant_one.price, Decimal("450.00"))
        self.assertEqual(self.variant_two.price, Decimal("430.00"))
        self.assertEqual(self.product.tags, ["party wear", "summer", "women"])

    def test_patch_replaces_uploaded_variant_images(self):
        original_image_name = self.variant_one.images.first().image.name
        payload = self.build_payload()
        payload["variation_images_0"] = make_test_image("green-replacement.gif")

        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=payload,
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.variant_one.refresh_from_db()
        refreshed_images = list(self.variant_one.images.all())

        self.assertEqual(len(refreshed_images), 1)
        self.assertNotEqual(refreshed_images[0].image.name, original_image_name)

    def test_patch_appends_gallery_images_without_removing_existing_ones(self):
        payload = self.build_payload()
        payload["gallery_images"] = make_test_image("gallery-new-1.gif")

        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=payload,
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.product.gallery_images.count(), 3)
        self.assertEqual(len(response.data["data"]["gallery"]), 3)

    def test_patch_removes_only_selected_gallery_images(self):
        payload = self.build_payload()
        payload["removed_gallery_image_ids"] = json.dumps([self.gallery_image_one.id])

        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=payload,
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        remaining_gallery_ids = list(
            self.product.gallery_images.order_by("sort_order", "id").values_list("id", flat=True)
        )
        self.assertEqual(remaining_gallery_ids, [self.gallery_image_two.id])

    def test_patch_appends_variant_images_without_removing_existing_ones(self):
        payload = self.build_payload()
        payload["variation_images_0"] = make_test_image("green-extra.gif")

        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=payload,
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.variant_one.images.count(), 2)

        response_variant = next(
            variation
            for variation in response.data["data"]["variations"]
            if variation["id"] == self.variant_one.id
        )
        self.assertEqual(len(response_variant["images"]), 2)

    def test_patch_removes_only_selected_variant_images(self):
        extra_variant_image = ProductVariantImage.objects.create(
            variant=self.variant_one,
            image=make_test_image("green-extra-remove.gif"),
            sort_order=1,
        )
        payload = self.build_payload()
        variations = json.loads(payload["variations"])
        variations[0]["removed_image_ids"] = [extra_variant_image.id]
        payload["variations"] = json.dumps(variations)

        response = self.client.patch(
            f"/product/{self.product.id}/",
            data=payload,
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.variant_one.images.count(), 1)
        self.assertFalse(
            self.variant_one.images.filter(id=extra_variant_image.id).exists()
        )
