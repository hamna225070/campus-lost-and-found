import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { itemService } from '../services/api';
import ItemCard from '../components/ItemCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import AlertMessage from '../components/AlertMessage';
import { CATEGORIES } from '../utils/formatters';

export const BrowseItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query values from URL
  const searchFromUrl = searchParams.get('search') || '';
  const typeFromUrl = searchParams.get('type') || 'all';
  const categoryFromUrl = searchParams.get('category') || 'all';
  const statusFromUrl = searchParams.get('status') || 'all';
  const sortFromUrl = searchParams.get('sort') || 'newest';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  // Local filter states
  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync state if URL changes
  useEffect(() => {
    setSearchInput(searchFromUrl);
    setCurrentPage(pageFromUrl);
  }, [searchFromUrl, pageFromUrl]);

  // Fetch items whenever URL parameters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          search: searchFromUrl || undefined,
          type: typeFromUrl !== 'all' ? typeFromUrl : undefined,
          category: categoryFromUrl !== 'all' ? categoryFromUrl : undefined,
          status: statusFromUrl !== 'all' ? statusFromUrl : undefined,
          sort: sortFromUrl,
          page: pageFromUrl,
          limit: 9,
        };

        const res = await itemService.getItems(params);
        if (res.success) {
          setItems(res.items || []);
          setTotalCount(res.totalCount || 0);
          setTotalPages(res.totalPages || 1);
          setCurrentPage(res.currentPage || 1);
        }
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError(err.message || 'Failed to load items from server');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchFromUrl, typeFromUrl, categoryFromUrl, statusFromUrl, sortFromUrl, pageFromUrl]);

  // Update URL search params helper
  const updateFilter = (updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const next = { ...current, ...updates, page: updates.page ? updates.page : 1 };

    // Clean up 'all' or empty values
    Object.keys(next).forEach((key) => {
      if (!next[key] || next[key] === 'all') {
        delete next[key];
      }
    });

    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter({ search: searchInput.trim(), page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Page Title & Quick Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Browse Campus Items
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Search through reported lost property and found items on campus
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/report/lost" className="btn btn-danger btn-sm">
              <PlusCircle size={16} />
              <span>Report Lost</span>
            </Link>
            <Link to="/report/found" className="btn btn-success btn-sm">
              <PlusCircle size={16} />
              <span>Report Found</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Search Row */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search by item name, description, or campus building..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {/* Filters Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              alignItems: 'end',
            }}
          >
            {/* Type Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Report Type
              </label>
              <select
                className="form-select"
                value={typeFromUrl}
                onChange={(e) => updateFilter({ type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="lost">Lost Items Only</option>
                <option value="found">Found Items Only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Category
              </label>
              <select
                className="form-select"
                value={categoryFromUrl}
                onChange={(e) => updateFilter({ category: e.target.value })}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Status
              </label>
              <select
                className="form-select"
                value={statusFromUrl}
                onChange={(e) => updateFilter({ status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open Reports</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>
                Sort By
              </label>
              <select
                className="form-select"
                value={sortFromUrl}
                onChange={(e) => updateFilter({ sort: e.target.value })}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title_asc">Item Name (A-Z)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ width: '100%' }}
                title="Reset all search filters"
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Showing <strong>{items.length}</strong> of <strong>{totalCount}</strong> listings
          </span>
          {currentPage > 1 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && <AlertMessage type="error" message={error} />}

        {/* Content Area */}
        {loading ? (
          <div className="loading-container">
            <span className="spinner spinner-lg"></span>
            <p>Searching database records...</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No Matching Items Found"
            description="We couldn't find any reports matching your search criteria. Try modifying your keywords or resetting filters."
            actionLabel="Reset All Filters"
            onActionClick={handleResetFilters}
          />
        ) : (
          <>
            <div className="cards-grid">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => updateFilter({ page: p })}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseItemsPage;
