const mongoose = require('mongoose');

const mongoUri = process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/letstry_dev?authSource=admin';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: String,
    description: String,
    codeValue: String,
    inCodeSet: String,
    productCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    categoryIds: [String],
    brand: String,
    currency: { type: String, default: 'INR' },
    ingredients: String,
    shelfLife: String,
    isVegetarian: { type: Boolean, default: true },
    isGlutenFree: { type: Boolean, default: false },
    variants: [{
        sku: String,
        name: String,
        price: Number,
        mrp: Number,
        discountPercent: Number,
        discountSource: String,
        weight: Number,
        weightUnit: String,
        packageSize: String,
        length: Number,
        height: Number,
        breadth: Number,
        stockQuantity: Number,
        availabilityStatus: String,
        images: [{ url: String, alt: String }],
        thumbnailUrl: String,
        isDefault: Boolean,
        isActive: Boolean
    }],
    images: [{ url: String, alt: String }],
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

const categoryImageUrl = 'https://d11a0m43ek7ap8.cloudfront.net/eaffe2ce9255d74a4ee81d3a20bdace9.webp';
const productImageUrl = 'https://d11a0m43ek7ap8.cloudfront.net/baf14c8fb442c0eadd20e2939de06905.webp';

const categoryNames = [
    'Fruits & Vegetables', 'Dairy & Bakery', 'Snacks & Branded Foods', 'Beverages',
    'Personal Care', 'Home Care', 'Baby Care', 'Meat & Seafood',
    'Breakfast & Instant Food', 'Grains, Oils & Masala', 'Kitchen & Dining', 'Cleaning & Household',
    'Beauty & Hygiene', 'Gourmet & World Food', 'Eggs, Meat & Fish', 'Health & Wellness',
    'Stationery & Office', 'Pet Care', 'Frozen Food', 'Organic & Healthy'
];

async function seed() {
    try {
        await mongoose.connect(mongoUri);

        await Category.deleteMany({});
        await Product.deleteMany({});

        for (let i = 0; i < categoryNames.length; i++) {
            const catName = categoryNames[i];
            const catSlug = catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

            const category = await Category.create({
                name: catName,
                slug: catSlug,
                imageUrl: categoryImageUrl,
                description: `Premium ${catName} for your daily needs.`,
                codeValue: `CAT${(i + 1).toString().padStart(3, '0')}`,
                inCodeSet: 'CATEGORIES'
            });

            const productsToInsert = [];
            for (let j = 1; j <= 10; j++) {
                const productName = `${catName} Item ${j}`;
                const productSlug = `${catSlug}-item-${j}`;
                const images = [
                    { url: productImageUrl, alt: `${productName} image 1` },
                    { url: productImageUrl, alt: `${productName} image 2` },
                    { url: productImageUrl, alt: `${productName} image 3` }
                ];

                productsToInsert.push({
                    name: productName,
                    slug: productSlug,
                    description: `High quality ${productName} sourced from the best suppliers. This product is part of our ${catName} collection.`,
                    categoryIds: [category._id.toString()],
                    brand: 'LetsTry',
                    currency: 'INR',
                    ingredients: 'Natural ingredients, no artificial preservatives.',
                    shelfLife: '12 months',
                    isVegetarian: true,
                    isGlutenFree: false,
                    images: images,
                    variants: [
                        {
                            sku: `${productSlug}-v1`,
                            name: `${productName} - Standard`,
                            price: 100 + (j * 10),
                            mrp: 120 + (j * 10),
                            discountPercent: 15,
                            discountSource: 'product',
                            weight: 500,
                            weightUnit: 'g',
                            packageSize: 'Medium',
                            length: 10, height: 15, breadth: 5,
                            stockQuantity: 50,
                            availabilityStatus: 'in_stock',
                            images: images,
                            thumbnailUrl: productImageUrl,
                            isDefault: true,
                            isActive: true
                        },
                        {
                            sku: `${productSlug}-v2`,
                            name: `${productName} - Large`,
                            price: 180 + (j * 15),
                            mrp: 220 + (j * 15),
                            discountPercent: 18,
                            discountSource: 'product',
                            weight: 1,
                            weightUnit: 'kg',
                            packageSize: 'Large',
                            length: 15, height: 20, breadth: 8,
                            stockQuantity: 30,
                            availabilityStatus: 'in_stock',
                            images: images,
                            thumbnailUrl: productImageUrl,
                            isDefault: false,
                            isActive: true
                        }
                    ]
                });
            }

            await Product.insertMany(productsToInsert);

            const count = await Product.countDocuments({ categoryIds: category._id.toString() });
            await Category.updateOne({ _id: category._id }, { productCount: count });
        }

        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

seed();
