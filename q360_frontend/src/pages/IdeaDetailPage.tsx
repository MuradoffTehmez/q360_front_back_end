// IdeaDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ArrowLeft, ThumbsUp, MessageCircle, Send, User, Calendar, Building, Tag } from 'lucide-react';
import { IdeasService, Idea, IdeaComment } from '../services/ideasService';

const IdeaDetailPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activePage, setActivePage] = useState('ideas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch idea details
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (id) {
          const ideaData = await IdeasService.getIdea(parseInt(id));
          setIdea(ideaData);
          
          const commentsData = await IdeasService.getIdeaComments(parseInt(id));
          setComments(commentsData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load idea details');
        console.error('Error fetching idea details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchIdeaDetails();
    }
  }, [id, user]);

  const handleUpvote = async () => {
    if (!id || !idea) return;
    
    try {
      const result = await IdeasService.upvoteIdea(parseInt(id));
      setIdea({
        ...idea,
        likes_count: result.likes_count
      });
    } catch (err: any) {
      console.error('Error upvoting idea:', err);
      alert('Upvoting failed: ' + err.message);
    }
  };

  const handleDownvote = async () => {
    if (!id || !idea) return;
    
    try {
      const result = await IdeasService.downvoteIdea(parseInt(id));
      setIdea({
        ...idea,
        likes_count: result.likes_count
      });
    } catch (err: any) {
      console.error('Error downvoting idea:', err);
      alert('Downvoting failed: ' + err.message);
    }
  };

  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    
    try {
      const comment = await IdeasService.addComment(parseInt(id), newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment: ' + err.message);
    }
  };

  const handleAddReply = async (parentId: number) => {
    if (!id || !replyContent.trim()) return;
    
    try {
      const comment = await IdeasService.addComment(parseInt(id), replyContent, parentId);
      setComments(comments.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...c.replies, comment] } 
          : c
      ));
      setReplyContent('');
      setReplyingTo(null);
    } catch (err: any) {
      console.error('Error adding reply:', err);
      alert('Failed to add reply: ' + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="İdea Detalları" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 123, 255, 0.2)',
              borderTop: '4px solid var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="İdea Detalları" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg) auto',
                color: 'var(--error-color)'
              }}>
                <MessageCircle size={32} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Səhv baş verdi</h3>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                {error}
              </p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Yenidən cəhd et
              </Button>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="İdea Detalları" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>İdea tapılmadı</h3>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                Tələb olunan idea tapılmadı.
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/ideas')}
              >
                İdeya Bankına Keç
              </Button>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        currentUser={user}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <Header title="İdea Detalları" />
        
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <button
            onClick={() => navigate('/ideas')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              padding: 'var(--spacing-sm) 0',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <ArrowLeft size={16} />
            Geri
          </button>
          
          <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div>
                <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{idea.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <User size={16} style={{ color: 'var(--secondary-text-color)' }} />
                    <span className="text-secondary">
                      {idea.submitter.first_name} {idea.submitter.last_name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <Calendar size={16} style={{ color: 'var(--secondary-text-color)' }} />
                    <span className="text-secondary">
                      {formatDate(idea.created_at)}
                    </span>
                  </div>
                  {idea.department && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <Building size={16} style={{ color: 'var(--secondary-text-color)' }} />
                      <span className="text-secondary">
                        {idea.department.name}
                      </span>
                    </div>
                  )}
                  {idea.category && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <Tag size={16} style={{ color: idea.category.color }} />
                      <span style={{ color: idea.category.color }}>
                        {idea.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: idea.status === 'implemented' 
                  ? 'rgba(40, 167, 69, 0.1)' 
                  : idea.status === 'approved' 
                    ? 'rgba(0, 123, 255, 0.1)' 
                    : 'rgba(255, 193, 7, 0.1)',
                color: idea.status === 'implemented' 
                  ? 'var(--success-color)' 
                  : idea.status === 'approved' 
                    ? 'var(--primary-color)' 
                    : '#FFC107',
                fontSize: 'var(--font-size-small)',
                fontWeight: 500
              }}>
                {idea.status === 'implemented' && 'Tətbiq Edilib'}
                {idea.status === 'approved' && 'Təsdiqlənib'}
                {idea.status === 'under_review' && 'İncələnir'}
                {idea.status === 'submitted' && 'Təqdim Edilib'}
                {idea.status === 'draft' && 'Qaralama'}
                {idea.status === 'rejected' && 'Rədd Edilib'}
              </div>
            </div>
            
            <p style={{ 
              margin: '0 0 var(--spacing-lg) 0',
              lineHeight: '1.6'
            }}>
              {idea.description}
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-lg)', 
              paddingTop: 'var(--spacing-sm)',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button 
                onClick={handleUpvote}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-xs)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-text-color)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-xs) 0'
                }}
              >
                <ThumbsUp size={16} />
                <span>{idea.likes_count} Upvote</span>
              </button>
              
              <button 
                onClick={handleDownvote}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-xs)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-text-color)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-xs) 0'
                }}
              >
                <ThumbsUp size={16} style={{ transform: 'rotate(180deg)' }} />
                <span>Downvote</span>
              </button>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)',
                color: 'var(--secondary-text-color)',
                padding: 'var(--spacing-xs) 0'
              }}>
                <MessageCircle size={16} />
                <span>{comments.length} Şərh</span>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 style={{ 
              margin: '0 0 var(--spacing-lg) 0',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <MessageCircle size={20} />
              Şərhlər
            </h3>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)', 
              marginBottom: 'var(--spacing-lg)' 
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Fikrinizi paylaşın..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-medium)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--primary-text-color)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size-base)',
                    resize: 'vertical',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                />
                <Button 
                  variant="primary" 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  <Send size={16} />
                  Şərh Əlavə Et
                </Button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-md)',
                  paddingBottom: 'var(--spacing-lg)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {comment.author.first_name.charAt(0)}{comment.author.last_name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)'
                    }}>
                      <span style={{ fontWeight: 500 }}>
                        {comment.author.first_name} {comment.author.last_name}
                      </span>
                      <span className="text-secondary text-small">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 var(--spacing-md) 0' }}>
                      {comment.content}
                    </p>
                    
                    {replyingTo === comment.id ? (
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-md)', 
                        marginTop: 'var(--spacing-md)' 
                      }}>
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--surface-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary-text-color)',
                          fontSize: 'var(--font-size-small)'
                        }}>
                          {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Cavab yazın..."
                            style={{
                              width: '100%',
                              minHeight: '60px',
                              padding: 'var(--spacing-sm)',
                              borderRadius: 'var(--border-radius-medium)',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--primary-text-color)',
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--font-size-small)',
                              resize: 'vertical',
                              marginBottom: 'var(--spacing-xs)'
                            }}
                          />
                          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <Button 
                              variant="secondary" 
                              size="small"
                              onClick={() => setReplyingTo(null)}
                            >
                              Ləğv et
                            </Button>
                            <Button 
                              variant="primary" 
                              size="small"
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim()}
                            >
                              Cavabla
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Cavabla
                      </Button>
                    )}
                    
                    {comment.replies.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'var(--spacing-md)',
                        marginTop: 'var(--spacing-md)',
                        marginLeft: 'var(--spacing-xl)'
                      }}>
                        {comment.replies.map((reply) => (
                          <div key={reply.id} style={{ 
                            display: 'flex', 
                            gap: 'var(--spacing-sm)'
                          }}>
                            <div style={{ 
                              width: '30px', 
                              height: '30px', 
                              borderRadius: '50%', 
                              backgroundColor: 'var(--surface-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary-text-color)',
                              fontSize: 'var(--font-size-small)'
                            }}>
                              {reply.author.first_name.charAt(0)}{reply.author.last_name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 'var(--spacing-xs)',
                                marginBottom: 'var(--spacing-xs)'
                              }}>
                                <span style={{ fontWeight: 500, fontSize: 'var(--font-size-small)' }}>
                                  {reply.author.first_name} {reply.author.last_name}
                                </span>
                                <span className="text-secondary text-small">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p style={{ 
                                margin: 0, 
                                fontSize: 'var(--font-size-small)' 
                              }}>
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-secondary" style={{ textAlign: 'center', margin: 'var(--spacing-xl) 0' }}>
                  Hələ şərh yoxdur. İlk şərhi siz əlavə edin!
                </p>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default IdeaDetailPage;