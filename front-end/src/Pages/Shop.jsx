import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchAllProducts } from '../features/products/productSlice'
import Item from '../components/Item'
import ProductCardLoader from '../Utils/loaders/ProductCardLoader'
import { fetchSubCategories } from '../features/products/subcategorySlice'
import { fetchCategories } from '../features/products/categorySlice'
import { getProductCount, getUniqueValues, filterProducts } from './shoputils/shopfunctions'

const Shop = () => {
    const [isHide, setIsHide] = useState(false)
    const dispatch = useDispatch()
    const { categoryList } = useSelector((state) => state.category)
    const { subCategoryList } = useSelector((state) => state.subCategory)
    const { products, loading, error } = useSelector((state) => state.products)
    const { id: categoryParam } = useParams()

    // state for filtered products
    const [filteredData, setFilteredData] = useState([])
    const [sortBy, setSortBy] = useState('Featured')
    const [sortOpen, setSortOpen] = useState(false)

    // filters state
    const [filters, setFilters] = useState({
        categories: new Set(),
        subcategories: new Set(),
        types: new Set(),
        colors: new Set(),
        sizes: new Set(),
        inStockOnly: false,
        priceMin: 0,
        priceMax: 0,
    })

    const getsubCategoryList = () => {
        if (subCategoryList.length === 0) {
            dispatch(fetchSubCategories())
        }
    }

    const getProductList = () => {
        if (products.length === 0) {
            dispatch(fetchAllProducts())
        }
    }

    const getParentCatgeory = () => {
        if (categoryList.length === 0) {
            dispatch(fetchCategories())
        }
    }
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [])

    useEffect(() => {
        getProductList()
        getsubCategoryList()
        getParentCatgeory()
    }, [dispatch, products.length, subCategoryList.length, categoryList.length])
    // when products load set initial data and default price range
    useEffect(() => {
        setFilteredData(products)
        if (products && products.length > 0) {
            const prices = products.map((p) => Number(p.price || 0)).filter(p => !isNaN(p))
            const max = prices.length ? Math.max(...prices) : 0
            setFilters((f) => ({ ...f, priceMax: max }))
        }
    }, [products])

    useEffect(() => {
        if (!categoryParam) return
        setFilters((prev) => ({
            ...prev,
            subcategories: new Set([String(categoryParam)]),
        }))
    }, [categoryParam])
    const skeletonCount = window.innerWidth >= 1024 ? 8 : 4

    const categoryCount = getProductCount(products, "category")
    const subCategoryCount = getProductCount(products, "subcategory")

    // available filter options derived from products
    const availableTypes = getUniqueValues(products, (p) => p.type)
    const availableColors = getUniqueValues(products, (p) => p.options?.flatMap(o => (o.values || [])))
    const availableSizes = getUniqueValues(products, (p) => p.options?.flatMap(o => (o.values || [])))

    const selectedSubCategory = useMemo(
        () => subCategoryList.find((sub) => String(sub.id) === String(categoryParam)),
        [subCategoryList, categoryParam]
    )

    const sortOptions = [
        'Featured',
        'Newest',
        'Price: High-Low',
        'Price: Low-High',
    ]

    const sortedData = useMemo(() => {
        const data = [...filteredData]
        if (sortBy === 'Newest') {
            return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }
        if (sortBy === 'Price: High-Low') {
            return data.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        }
        if (sortBy === 'Price: Low-High') {
            return data.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        }
        if (sortBy === 'Featured') {
            return data.sort((a, b) => (b.featured === true) - (a.featured === true))
        }
        return data
    }, [filteredData, sortBy])

    // apply filters whenever filters or products change
    useEffect(() => {
        const result = filterProducts(products, filters)
        setFilteredData(result)
    }, [products, filters])

    console.log(products)

    return (
        <>
            <div className='w-full grid grid-cols-12 gap-3 p-4 relative'>
                <aside className={`${isHide ? "hidden" : "col-span-2"} h-[100vh] bg-gray-700 rounded-sm  overflow-hidden`}>

                    <div className="h-full overflow-hidden">
                        <div className="flex w-full h-full flex-col gap-6 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" style={{ maxHeight: 'calc(100vh - 3rem)' }}>
                            <div className="mt-0">
                                <button className="w-full bg-white text-gray-800 py-2 rounded" onClick={() => {
                                    const allPrices = products.map((p) => Number(p.price || 0)).filter(p => !isNaN(p))
                                    const overallMax = allPrices.length ? Math.max(...allPrices) : 0
                                    setFilters({ categories: new Set(), subcategories: new Set(), types: new Set(), colors: new Set(), sizes: new Set(), inStockOnly: false, priceMin: 0, priceMax: overallMax })
                                }}>Clear Filters</button>
                            </div>
                            {/* Categories */}
                            {categoryList && categoryList.length > 0 && (
                                <div>
                                    <h4 className="text-gray-200 font-semibold mb-2">Categories</h4>
                                    <div className="flex flex-col gap-2">
                                        {categoryList.map(cat => {
                                            const id = String(cat.id)
                                            const count = categoryCount?.[cat.id] || 0
                                            const checked = filters.categories.has(id)
                                            return (
                                                <label key={id} className="flex items-center gap-2 text-gray-200">
                                                    <input type="checkbox" checked={checked} onChange={() => setFilters(prev => {
                                                        const next = new Set(prev.categories)
                                                        if (next.has(id)) next.delete(id); else next.add(id)
                                                        return { ...prev, categories: next }
                                                    })} />
                                                    <span className="ml-2">{cat.name} <small className="text-gray-400">({count})</small></span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Subcategories */}
                            {subCategoryList && subCategoryList.length > 0 && (
                                <div>
                                    <h4 className="text-gray-200 font-semibold mb-2">Subcategories</h4>
                                    <div className="flex flex-col gap-2 max-h-40 overflow-auto pr-2">
                                        {subCategoryList.map(sc => {
                                            const id = String(sc.id)
                                            const checked = filters.subcategories.has(id)
                                            return (
                                                <label key={id} className="flex items-center gap-2 text-gray-200">
                                                    <input type="checkbox" checked={checked} onChange={() => setFilters(prev => {
                                                        const next = new Set(prev.subcategories)
                                                        if (next.has(id)) next.delete(id); else next.add(id)
                                                        return { ...prev, subcategories: next }
                                                    })} />
                                                    <span className="ml-2">{sc.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {/* {availableColors && availableColors.length > 0 && (
                                <div>
                                    <h4 className="text-gray-200 font-semibold mb-2">Colors</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map(c => {
                                            const id = String(c)
                                            const active = filters.colors.has(id)
                                            // use inline bg color if possible
                                            const style = { backgroundColor: id.toLowerCase() }
                                            return (
                                                <button key={id} onClick={() => setFilters(prev => {
                                                    const next = new Set(prev.colors)
                                                    if (next.has(id)) next.delete(id); else next.add(id)
                                                    return { ...prev, colors: next }
                                                })} className={`w-8 h-8 rounded-full border ${active ? 'ring-2 ring-white' : 'opacity-80'}`} style={style} title={id} />
                                            )
                                        })}
                                    </div>
                                </div>
                            )} */}

                            {/* Price range */}
                            <div className="bg-gray-800 rounded-xl border border-gray-600 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-gray-100 font-semibold">Price range</h4>
                                        <p className="text-sm text-gray-400">Filter by min / max price</p>
                                    </div>
                                    <SlidersHorizontal className="text-gray-300" size={18} />
                                </div>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="flex flex-col text-gray-400 text-xs">
                                            Min.
                                            <input
                                                type="number"
                                                min={0}
                                                value={filters.priceMin}
                                                onChange={(e) => setFilters(f => ({ ...f, priceMin: Number(e.target.value || 0) }))}
                                                className="mt-2 w-full bg-gray-900 text-gray-100 p-2 rounded border border-gray-700"
                                            />
                                        </label>
                                        <label className="flex flex-col text-gray-400 text-xs">
                                            Max.
                                            <input
                                                type="number"
                                                min={0}
                                                value={filters.priceMax}
                                                onChange={(e) => setFilters(f => ({ ...f, priceMax: Number(e.target.value || 0) }))}
                                                className="mt-2 w-full bg-gray-900 text-gray-100 p-2 rounded border border-gray-700"
                                            />
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative h-2 rounded-full bg-gray-700 overflow-hidden">
                                            <div className="absolute inset-y-0 bg-white rounded-full" style={{ left: `${(filters.priceMin / Math.max(filters.priceMax, 1)) * 100}%`, right: `${100 - (filters.priceMax / Math.max(filters.priceMax, 1)) * 100}%` }} />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>₹{filters.priceMin}</span>
                                            <span>₹{filters.priceMax}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            {/* <div className="bg-gray-800 rounded-xl border border-gray-600 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-gray-100 font-semibold">Availability</h4>
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">fast</span>
                                </div>
                                <label className="flex items-center gap-3 text-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStockOnly}
                                        onChange={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                                        className="h-4 w-4 text-white bg-gray-900 border-gray-600 rounded"
                                    />
                                    Show in-stock only
                                </label>
                            </div> */}

                            {/* Product type */}
                            {/* {availableTypes && availableTypes.length > 0 && (
                                <div className="bg-gray-800 rounded-xl border border-gray-600 p-4">
                                    <h4 className="text-gray-100 font-semibold mb-3">Product type</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableTypes.map(type => {
                                            const id = String(type)
                                            const active = filters.types.has(id)
                                            return (
                                                <button
                                                    key={id}
                                                    onClick={() => setFilters(prev => {
                                                        const next = new Set(prev.types)
                                                        if (next.has(id)) next.delete(id); else next.add(id)
                                                        return { ...prev, types: next }
                                                    })}
                                                    className={`px-3 py-1 rounded-full text-sm ${active ? 'bg-white text-gray-900' : 'bg-gray-900 text-gray-300'}`}
                                                >
                                                    {id}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )} */}



                            {/* Sizes */}
                            {availableSizes && availableSizes.length > 0 && (
                                <div>
                                    <h4 className="text-gray-200 font-semibold mb-2">Sizes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(s => {
                                            const id = String(s)
                                            const active = filters.sizes.has(id)
                                            return (
                                                <button key={id} onClick={() => setFilters(prev => {
                                                    const next = new Set(prev.sizes)
                                                    if (next.has(id)) next.delete(id); else next.add(id)
                                                    return { ...prev, sizes: next }
                                                })} className={`px-3 py-1 rounded-md text-sm ${active ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-200'}`}>
                                                    {s}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <button className="w-full bg-white text-gray-800 py-2 rounded" onClick={() => {
                                    const allPrices = products.map((p) => Number(p.price || 0)).filter(p => !isNaN(p))
                                    const overallMax = allPrices.length ? Math.max(...allPrices) : 0
                                    setFilters({ categories: new Set(), subcategories: new Set(), types: new Set(), colors: new Set(), sizes: new Set(), inStockOnly: false, priceMin: 0, priceMax: overallMax })
                                }}>Clear Filters</button>
                            </div>

                        </div>
                    </div>

                </aside>

                <div className={`${isHide ? "col-span-12" : "col-span-10"}`}>

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end ">
                        {/* <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">{selectedSubCategory ? 'Category' : 'Shop'}</p>
                            <h1 className="text-3xl font-semibold text-white">{selectedSubCategory?.name || 'All Products'}</h1>
                        </div> */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                            <button className="inline-flex items-center gap-2 text-sm font-medium text-white" onClick={() => setIsHide((e) => !e)}>

                                {isHide ? 'Show Filters' : 'Hide Filters'}
                                <SlidersHorizontal size={16} />
                            </button>
                            <div className="relative inline-flex items-center gap-2">
                                <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm" onClick={() => setSortOpen((open) => !open)}>
                                    Sort By
                                    {sortOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {sortOpen && (
                                    <div className="absolute  right-0 top-full z-50 mt-2 w-48 rounded-3xl border border-gray-400 bg-white p-3 shadow-lg">
                                        {sortOptions.map((option) => (
                                            <button key={option} className={`w-full text-left px-3 py-2 text-sm ${sortBy === option ? 'font-semibold text-gray-900' : 'text-gray-600'}`} onClick={() => { setSortBy(option); setSortOpen(false) }}>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-10 px-6 md:px-0 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 items-start'>

                        {
                            loading &&
                            Array(skeletonCount).fill(0).map((_, index) => (
                                <ProductCardLoader key={index} />
                            ))
                        }

                        {
                            !loading &&
                            sortedData.map((product) => (
                                <Item key={product.id} product={product} />
                            ))
                        }

                        {
                            error &&
                            <p className='text-red-500 text-center col-span-full'>
                                {error.data?.message || error.message || "An error occurred"}
                            </p>
                        }

                    </div>

                </div>

            </div>
        </>
    )
}

export default Shop