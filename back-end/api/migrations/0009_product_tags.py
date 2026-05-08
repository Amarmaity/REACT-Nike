from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_remove_product_size_product_base_sku_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="tags",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
