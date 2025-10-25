import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Crown, 
  Shield, 
  ChevronRight, 
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Joined_groups.css';
import { getJoinedGroups } from '../../services/groupService';
const JoinedGroups = () => {
  const navigate = useNavigate();
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, alphabetical, members

    // Fetch joined groups from API
    const fetchJoinedGroups = async (cursor = null) => {
        try {
          setLoading(true);
          const data = await getJoinedGroups(cursor, 20);
          
          if (cursor) {
            // Pagination: append to existing groups
            setJoinedGroups((prev) => [...prev, ...(data.items || [])]);
          } else {
            // Initial load: replace groups
            setJoinedGroups(data.items || []);
          }
          
          setNextCursor(data.nextCursor);
        } catch (err) {
          console.error('Error fetching joined groups:', err);
        } finally {
          setLoading(false);
        }
      };
    
      // Fetch groups on component mount
      useEffect(() => {
        fetchJoinedGroups();
      }, []);
      const decodeGroupName = (name) => {
        try {
          return decodeURIComponent(name);
        } catch (e) {
          return name;
        }
      };



  // Get role icon based on user's role in the group
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="role-icon role-icon-admin" />;
      case 'moderator':
        return <Shield className="role-icon role-icon-moderator" />;
      default:
        return <Users className="role-icon role-icon-member" />;
    }
  };

  // Get role badge styling
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-badge-admin';
      case 'moderator':
        return 'role-badge role-badge-moderator';
      default:
        return 'role-badge role-badge-member';
    }
  };

  // Navigate to group detail page
  const handleGroupClick = (categoryKey) => {
    navigate(`/groups/${categoryKey}`);
  };

  // Filter groups based on search term
  const filteredGroups = joinedGroups.filter(group =>
    decodeGroupName(group.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort groups based on selected option
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.joinedAt) - new Date(a.joinedAt);
    }
    if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'members') {
      return (b.membersCount || 0) - (a.membersCount || 0);
    }
    return 0;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };


  return (
    <div className="joined-groups-container">
      {/* Header Section */}
      <div className="joined-groups-header">
        <div className="header-content">
          <div className="header-title-section">
            <Users className="header-icon" />
            <div>
              <h1 className="header-title">My Groups</h1>
              <p className="header-subtitle">
                {joinedGroups.length} {joinedGroups.length === 1 ? 'group' : 'groups'} joined
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="filters-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-wrapper">
            <Filter className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Recently Joined</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="members">Most Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="groups-content">
        {loading && joinedGroups.length === 0 ? (
          <div className="loading-state">
            <Loader2 className="loading-spinner" />
            <p className="loading-text">Loading your groups...</p>
          </div>
        ) : sortedGroups.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <h2 className="empty-title">No groups yet</h2>
            <p className="empty-description">
              {searchTerm 
                ? `No groups found matching "${searchTerm}"`
                : "Join book category groups to connect with other readers!"
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => navigate('/explore')} 
                className="explore-button"
              >
                Explore Groups
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="groups-grid">
              {sortedGroups.map((group) => (
                <div
                  key={group.groupId}
                  className="group-card"
                  onClick={() => handleGroupClick(group.categoryKey || group.name)}
                >
                  <div className="group-card-header">
                    <div className="group-info">
                      <h3 className="group-name">{decodeGroupName(group.name)}</h3>
                      <p className="group-members">
                        {group.membersCount || 0} {group.membersCount === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                    <ChevronRight className="group-arrow" />
                  </div>

                  <div className="group-card-footer">
                    <div className={getRoleBadgeClass(group.role)}>
                      {getRoleIcon(group.role)}
                      <span className="role-text">
                        {group.role.charAt(0).toUpperCase() + group.role.slice(1)}
                      </span>
                    </div>
                    <div className="joined-date">
                      Joined {formatDate(group.joinedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {nextCursor && (
              <div className="load-more-section">
                <button
                  onClick={() => fetchJoinedGroups(nextCursor)}
                  disabled={loading}
                  className="load-more-button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="button-spinner" />
                      Loading...
                    </>
                  ) : (
                    'Load More Groups'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JoinedGroups;