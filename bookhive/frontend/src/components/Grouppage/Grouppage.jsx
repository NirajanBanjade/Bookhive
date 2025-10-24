import './GroupPage.css';

const GroupPage = () => {

  return (
    <div className="group-page-container">
      {/* Header */}
      <div className="group-page-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/groups')}
        >
          <ArrowLeft className="back-icon" />
        </button>

        <div className="group-header-info">
          <Users className="group-header-icon" />
          <div>
            <h1 className="group-title">{decodeCategory(category)}</h1>
            <p className="group-subtitle">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>

        <button 
          className="create-post-button"
          onClick={() => setShowCreateModal(true)}
        >
          <MessageSquarePlus className="create-icon" />
          New Post
        </button>
      </div>
    </div>
  );
};

export default GroupPage;