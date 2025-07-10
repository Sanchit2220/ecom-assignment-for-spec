import React, { useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
  Search,
  Filter,
  X,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
//import products from '../ProductData';

// Media query helper
const md = (...a) => css`
  @media (min-width: 768px) {
    ${css(...a)}
  }
`;

// Styled Components (same as your code)
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%);
  font-family: 'Inter', Arial, sans-serif;
  overflow-x: hidden;
  margin-left: 20rem;
`;
const Header = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0 0 0 / 0.05);
`;
const HeaderInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem;
`;
const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
`;
const SearchWrap = styled.div`
  position: relative;
  max-width: 384px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
    border-color: transparent;
  }
`;
const MobileFiltersBtn = styled.button`
  ${md`display:none;`}
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
`;
const Badge = styled.span`
  background: #dc2626;
  color: #fff;
  border-radius: 9999px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
`;
const Main = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  ${md`flex-direction: row;`}
`;
const Sidebar = styled.aside`
  width: 17rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  padding: 2.5rem 2rem 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(37,99,235,0.10);
  height: 100vh;
  border: 1.5px solid #e0e7ef;
  font-family: 'Inter', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto;
`;
const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  background: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    color: #b91c1c;
  }
`;
const Section = styled.div`
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.7);
  border-radius: 0.75rem;
  box-shadow: 0 1px 6px rgba(37,99,235,0.06);
  padding: 1.2rem 1rem;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    background: #e0e7ef;
    box-shadow: 0 4px 16px rgba(37,99,235,0.10);
  }
`;
const SectionTitle = styled.h3`
  font-weight: 500;
  margin-bottom: 0.75rem;
`;
const RangeInput = styled.input`
  width: 100%;
  margin-top: 0.5rem;
`;
const ProductsWrap = styled.section`
  flex: 1;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const Grid = styled.div`
  display: grid;
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;
const Card = styled.div`
  background: rgba(255,255,255,0.85);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(37,99,235,0.13);
  padding: 1.2rem 0.8rem 1.2rem 0.8rem;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  backdrop-filter: blur(8px);
  border: 1.5px solid #e0e7ef;
  width: 280px;
  height: 440px;
  min-width: 280px;
  max-width: 280px;
  min-height: 440px;
  max-height: 440px;
  margin: 0 auto;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
  &:hover {
    box-shadow: 0 16px 48px rgba(37,99,235,0.18);
    transform: translateY(-8px) scale(1.045);
    border: 1.5px solid #2563eb;
  }
`;
const Emoji = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 0.75rem;
`;
const Name = styled.h3`
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;
const Brand = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;
const Category = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;
const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
  svg {
    fill: #facc15;
    flex-shrink: 0;
  }
`;
const Price = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  color: #059669;
`;
const Specs = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.75rem 0;
  line-height: 1.3;
`;
const CartBtn = styled.button`
  width: 100%;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s;
  &:hover {
    background: #1e40af;
  }
`;

// Pagination controls
const Pager = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;
const PageBtn = styled.button`
  border: 1px solid #d1d5db;
  background: ${({ $active }) => ($active ? '#2563eb' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#111827')};
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Main ProductCatalog component for displaying and filtering products
const ProductCatalog = () => {
  // State hooks for filters, search, pagination, and product data
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [searchInput, setSearchInput] = useState(''); // for input box
  const [searchTerm, setSearchTerm] = useState('');   // debounced value
  // Remove showFilters state and related logic
  // const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('featured');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Store all possible filter options from the backend
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);

  // On backend fetch, set all* arrays directly from response
  // useEffect(() => {
  //   setAllCategories(categories);
  //   setAllBrands(brands);
  //   setAllColors(colors);
  //   setAllMaterials(materials);
  // }, [categories, brands, colors, materials]);

  // Helper to get count for a value from facet array
  const getCount = (facetArr, value) => {
    const found = facetArr.find(f => f.value === value);
    return found ? found.count : 0;
  };

  const ITEMS_PER_PAGE = 12;

  // On mount, initialize state from URL query params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') ? searchParams.get('category').split(',') : [];
    const brand = searchParams.get('brand') ? searchParams.get('brand').split(',') : [];
    const priceMin = searchParams.get('price_min') ? Number(searchParams.get('price_min')) : 0;
    const priceMax = searchParams.get('price_max') ? Number(searchParams.get('price_max')) : 2000;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const sort = searchParams.get('sort') || 'featured';
    setSearchInput(search); // initialize input
    setSearchTerm(search);
    setSelectedCategories(category);
    setSelectedBrands(brand);
    setPriceRange([priceMin, priceMax]);
    setCurrentPage(page);
    setSortOption(sort);
  }, [searchParams]);

  // On first load, store all filter options
  // useEffect(() => {
  //   // These are now set directly from the backend response
  //   // if (allCategories.length === 0 && categories.length > 0) setAllCategories(categories);
  //   // if (allBrands.length === 0 && brands.length > 0) setAllBrands(brands);
  //   // if (allColors.length === 0 && colors.length > 0) setAllColors(colors);
  //   // if (allMaterials.length === 0 && materials.length > 0) setAllMaterials(materials);
  //   // eslint-disable-next-line
  // }, [categories, brands, colors, materials]);

  // Debounce search input to avoid excessive filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch products from backend API when filters/search/page/sort change
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Build query string
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategories.length) params.append('category', selectedCategories.join(','));
    if (selectedBrands.length) params.append('brand', selectedBrands.join(','));
    if (selectedColors.length) params.append('color', selectedColors.map(c => c.trim().toLowerCase()).join(','));
    if (selectedMaterials.length) params.append('material', selectedMaterials.map(m => m.trim().toLowerCase()).join(','));
    if (priceRange[0] !== 0) params.append('price_min', priceRange[0]);
    if (priceRange[1] !== 2000) params.append('price_max', priceRange[1]);
    if (currentPage !== 1) params.append('page', currentPage);
    if (sortOption && sortOption !== 'featured') params.append('sort_by', sortOption.split('_')[0]);
    if (sortOption && sortOption !== 'featured') params.append('sort_order', sortOption.endsWith('desc') ? 'desc' : 'asc');
    params.append('pageSize', ITEMS_PER_PAGE);
    const queryString = params.toString();
    console.log('API Query String:', queryString);
    fetch(`http://localhost:5000/api/products?${queryString}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setBrands(data.brands || []);
        setCategories(data.categories || []);
        setColors(data.colors || []);
        setMaterials(data.materials || []);
        setAllBrands(data.allBrands || []);
        setAllCategories(data.allCategories || []);
        setAllColors(data.allColors || []);
        setAllMaterials(data.allMaterials || []);
        setLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.json) {
          err.response.json().then(data => {
            setError(data.error || err.message);
          }).catch(() => setError(err.message));
        } else {
          setError(err.message);
        }
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [searchTerm, selectedCategories, selectedBrands, selectedColors, selectedMaterials, priceRange, currentPage, sortOption]);

  // Generate filter options from all products currently loaded
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  const uniqueColors = Array.from(new Set(products.map((p) => p.color))).filter(Boolean);
  const uniqueMaterials = Array.from(new Set(products.map((p) => p.material))).filter(Boolean);

  const priceRanges = [
    { label: '$0–50', min: 0, max: 50 },
    { label: '$50–100', min: 50, max: 100 },
    { label: '$100–200', min: 100, max: 200 },
    { label: '$200–500', min: 200, max: 500 },
    { label: '$500+', min: 500, max: 5000 },
  ];

  // No need to filter/slice products on frontend anymore
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Sorting logic: sort filtered products based on selected sort option
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating_desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    return sorted;
  }, [products, sortOption]);

  // Remove client-side slicing for pagination
  // const paginatedProducts = sortedProducts.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  // Helper to toggle multi-select filters
  const toggleMulti = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  // Handler for selecting price range
  const handlePriceRangeSelect = (range) =>
    setPriceRange([range.min, range.max]);

  // Clear all filters and search
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setPriceRange([0, 2000]);
    setSearchTerm('');
    setSearchParams({}); // Reset URL to default
  };

  const activeFilters =
    selectedCategories.length +
    selectedBrands.length +
    selectedColors.length +
    selectedMaterials.length +
    (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0);

  useEffect(() => {
    console.log('Brands:', brands);
    console.log('Categories:', categories);
    console.log('Colors:', colors);
    console.log('Materials:', materials);
  }, [brands, categories, colors, materials]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{color:'red',fontWeight:'bold'}}>Error loading products: {error}</div>;
  // Remove early return for products.length === 0 so the full layout is always shown

  return (
    <Page>
      <Header>
        <HeaderInner>
          <Title>Product Catalog</Title>
          <SearchWrap>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <SearchInput
              placeholder='Search products…'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </SearchWrap>
          {/* Remove MobileFiltersBtn and toggle logic */}
        </HeaderInner>
      </Header>

      <Main>
        {/* Render Sidebar always visible */}
        <Sidebar>
          <FilterHeader>
            <h2>Filters</h2>
            {activeFilters > 0 && (
              <ClearBtn onClick={clearAllFilters}>
                <X size={14} /> Clear All
              </ClearBtn>
            )}
          </FilterHeader>

          <Section>
            <SectionTitle>Categories</SectionTitle>
            {allCategories.length > 0 ? allCategories.map((c) => (
              <label key={c}>
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(c)}
                  onChange={() => {
                    const params = Object.fromEntries([...searchParams]);
                    let arr = selectedCategories.includes(c)
                      ? selectedCategories.filter(x => x !== c)
                      : [...selectedCategories, c];
                    if (arr.length) params.category = arr.join(','); else delete params.category;
                    params.page = 1;
                    setSearchParams(params, { replace: true });
                  }}
                />{' '}
                {c} <span style={{color:'#888'}}>({getCount(categories, c)})</span>
              </label>
            )) : <div style={{color:'#888',fontSize:'0.95em'}}>No categories available</div>}
          </Section>

          <Section>
            <SectionTitle>Brands</SectionTitle>
            {allBrands.length > 0 ? allBrands.map((b) => (
              <label key={b}>
                <input
                  type='checkbox'
                  checked={selectedBrands.includes(b)}
                  onChange={() => {
                    const params = Object.fromEntries([...searchParams]);
                    let arr = selectedBrands.includes(b)
                      ? selectedBrands.filter(x => x !== b)
                      : [...selectedBrands, b];
                    if (arr.length) params.brand = arr.join(','); else delete params.brand;
                    params.page = 1;
                    setSearchParams(params, { replace: true });
                  }}
                />{' '}
                {b} <span style={{color:'#888'}}>({getCount(brands, b)})</span>
              </label>
            )) : <div style={{color:'#888',fontSize:'0.95em'}}>No brands available</div>}
          </Section>

          <Section>
            <SectionTitle>Price Range</SectionTitle>
            {priceRanges.map((r) => (
              <label key={r.label}>
                <input
                  type='radio'
                  name='priceRange'
                  checked={priceRange[0] === r.min && priceRange[1] === r.max}
                  onChange={() => {
                    const params = Object.fromEntries([...searchParams]);
                    params.price_min = r.min;
                    params.price_max = r.max;
                    params.page = 1;
                    setSearchParams(params, { replace: true });
                  }}
                />{' '}
                {r.label}
              </label>
            ))}
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', fontSize: '0.875rem' }}>
              ${priceRange[0]} – ${priceRange[1]}
              <RangeInput
                type='range'
                min='0'
                max='2000'
                step='50'
                value={priceRange[1]}
                onChange={(e) => {
                  const params = Object.fromEntries([...searchParams]);
                  params.price_min = priceRange[0];
                  params.price_max = parseInt(e.target.value, 10);
                  params.page = 1;
                  setSearchParams(params, { replace: true });
                }}
              />
            </div>
          </Section>

          <Section>
            <SectionTitle>Colors</SectionTitle>
            {allColors.length > 0 ? allColors.map((color) => (
              <label key={color}>
                <input
                  type='checkbox'
                  checked={selectedColors.includes(color)}
                  onChange={() => {
                    const params = Object.fromEntries([...searchParams]);
                    let arr = selectedColors.includes(color)
                      ? selectedColors.filter(x => x !== color)
                      : [...selectedColors, color];
                    if (arr.length) params.color = arr.join(','); else delete params.color;
                    params.page = 1;
                    setSearchParams(params, { replace: true });
                  }}
                />{' '}
                {color} <span style={{color:'#888'}}>({getCount(colors, color)})</span>
              </label>
            )) : <div style={{color:'#888',fontSize:'0.95em'}}>No colors available</div>}
          </Section>

          <Section>
            <SectionTitle>Materials</SectionTitle>
            {allMaterials.length > 0 ? allMaterials.map((m) => (
              <label key={m}>
                <input
                  type='checkbox'
                  checked={selectedMaterials.includes(m)}
                  onChange={() => {
                    const params = Object.fromEntries([...searchParams]);
                    let arr = selectedMaterials.includes(m)
                      ? selectedMaterials.filter(x => x !== m)
                      : [...selectedMaterials, m];
                    if (arr.length) params.material = arr.join(','); else delete params.material;
                    params.page = 1;
                    setSearchParams(params, { replace: true });
                  }}
                />{' '}
                {m} <span style={{color:'#888'}}>({getCount(materials, m)})</span>
              </label>
            )) : <div style={{color:'#888',fontSize:'0.95em'}}>No materials available</div>}
          </Section>
        </Sidebar>

        <ProductsWrap>
          <TopBar>
            <h2>{totalCount} Products Found</h2>
            <select value={sortOption} onChange={e => {
              const params = Object.fromEntries([...searchParams]);
              params.sort = e.target.value;
              params.page = 1;
              setSearchParams(params, { replace: true });
            }}>
              <option value="featured">Sort by: Featured</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="rating_desc">Rating: High → Low</option>
              <option value="newest">Newest First</option>
            </select>
          </TopBar>

          <Grid>
            {sortedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card>
                  <div style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    minWidth: '40%',
                    minHeight: '40%',
                    maxWidth: 220,
                    maxHeight: 220,
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(37,99,235,0.13)',
                    border: '2.5px solid #fff',
                    marginBottom: 12,
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                  }}>
                    <img
                      src={p.image && p.image.trim() !== '' ? p.image : '/default-product.png'}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, border: '1.5px solid #e0e7ef', background: '#fff', display: 'block' }}
                    />
                  </div>
                  <span style={{
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '2px 14px',
                    borderRadius: 999,
                    letterSpacing: 1,
                    marginBottom: 8,
                    boxShadow: '0 1px 6px rgba(37,99,235,0.10)'
                  }}>{p.category}</span>
                  <Name style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 6, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>{p.name}</Name>
                  <Brand style={{ color: '#2563eb', fontWeight: 500 }}>{p.brand}</Brand>
                  <RatingRow style={{ justifyContent: 'center', margin: '8px 0' }}>
                    <Star size={16} style={{ color: '#f59e42', marginRight: 2 }} />
                    {p.rating}
                  </RatingRow>
                  <Price style={{ color: '#059669', fontSize: 22, background: 'linear-gradient(90deg, #e0f2fe 0%, #f0fdf4 100%)', borderRadius: 10, padding: '4px 16px', margin: '12px 0 16px 0', display: 'inline-block', fontWeight: 700, boxShadow: '0 1px 6px rgba(5,150,105,0.08)' }}>${p.price}</Price>
                  <Specs style={{ color: '#334155', fontSize: 14, textAlign: 'center', minHeight: 38, marginBottom: 8, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    Color: {p.color}
                    <br />
                    Material: {p.material}
                    {p.storage && (
                      <>
                        <br />
                        Storage: {p.storage}
                      </>
                    )}
                    {p.size && (
                      <>
                        <br />
                        Size: {p.size}
                      </>
                    )}
                    {p.capacity && (
                      <>
                        <br />
                        Capacity: {p.capacity}
                      </>
                    )}
                  </Specs>
                  <CartBtn style={{ marginTop: 8, fontWeight: 600, fontSize: 15, borderRadius: 8, boxShadow: '0 1px 6px rgba(37,99,235,0.08)' }}>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </CartBtn>
                </Card>
              </Link>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pager>
              <PageBtn onClick={() => {
                const params = Object.fromEntries([...searchParams]);
                params.page = currentPage - 1;
                setSearchParams(params, { replace: true });
              }} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageBtn key={n} $active={n === currentPage} onClick={() => {
                  const params = Object.fromEntries([...searchParams]);
                  params.page = n;
                  setSearchParams(params, { replace: true });
                }}>
                  {n}
                </PageBtn>
              ))}
              <PageBtn onClick={() => {
                const params = Object.fromEntries([...searchParams]);
                params.page = currentPage + 1;
                setSearchParams(params, { replace: true });
              }} disabled={currentPage === totalPages}>
                <ChevronRight size={16} />
              </PageBtn>
            </Pager>
          )}

          {totalCount === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: 20, fontWeight: 600 }}>
                No products found for your search/filter.
              </p>
              <CartBtn
                as='button'
                style={{ width: 'auto', padding: '0.5rem 1.5rem' }}
                onClick={clearAllFilters}
              >
                Clear All Filters
              </CartBtn>
            </div>
          )}
        </ProductsWrap>
      </Main>
    </Page>
  );
};

export default ProductCatalog;
