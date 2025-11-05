'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  ArrowLeft,
  Share2,
  Star,
  MessageSquare,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Send,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api-client';
import type { ProjectDetail, Comment as ProjectComment } from '@/types';
import toast from 'react-hot-toast';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await apiClient.getProject(params.id);
        setProject(data);
      } catch (err: any) {
        console.error('Failed to load project:', err);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [params.id]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await apiClient.getProjectComments(params.id);
        setComments(data);
      } catch (err: any) {
        console.error('Failed to load comments:', err);
      }
    };

    if (params.id) {
      loadComments();
    }
  }, [params.id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this infrastructure project: ${project?.title}`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setShowShareMenu(false);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSubmittingComment(true);
    try {
      const newCommentData = await apiClient.createComment(params.id, {
        author_name: authorName,
        author_email: authorEmail || undefined,
        comment_text: newComment,
        rating: selectedRating || undefined,
      });

      setComments([newCommentData, ...comments]);
      setNewComment('');
      setAuthorName('');
      setAuthorEmail('');
      setSelectedRating(null);
      toast.success('Comment posted successfully!');
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      proposed: 'bg-gray-100 text-gray-800',
      tendered: 'bg-blue-100 text-blue-800',
      awarded: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      stalled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  const positiveCount = comments.filter((c) => c.rating && c.rating >= 4).length;
  const negativeCount = comments.filter((c) => c.rating && c.rating <= 2).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4" />
                Share Project
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span>Share on Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Twitter className="w-5 h-5 text-sky-500" />
                    <span>Share on Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <span>Share on LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span>Share on WhatsApp</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                    <span>Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-semibold text-gray-900">
                  {project.budget_amount
                    ? `₹${(project.budget_amount / 10000000).toFixed(2)} Cr`
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Ward</p>
                <p className="font-semibold text-gray-900">{project.ward?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {project.start_date
                    ? new Date(project.start_date).toLocaleDateString('en-IN')
                    : 'Not started'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Expected Completion</p>
                <p className="font-semibold text-gray-900">
                  {project.expected_end_date
                    ? new Date(project.expected_end_date).toLocaleDateString('en-IN')
                    : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Updates */}
            {project.progress_updates && project.progress_updates.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Progress Updates</h2>
                <div className="space-y-4">
                  {project.progress_updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{update.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {update.reported_at
                          ? new Date(update.reported_at).toLocaleDateString('en-IN')
                          : 'Recent'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Public Reviews & Comments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Public Reviews</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    {positiveCount}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    {negativeCount}
                  </span>
                </div>
              </div>

              {/* Comment Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Leave a Comment</h3>
                
                <div className="space-y-3 mb-3">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name *"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your feedback about this project..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Your rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`p-1 rounded ${
                          selectedRating && selectedRating >= star
                            ? 'text-yellow-500'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-gray-900">{comment.author_name}</span>
                            <span className="text-xs text-gray-500">{formatTimestamp(comment.created_at)}</span>
                            {comment.rating && comment.rating > 0 && (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: comment.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.comment_text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contractors */}
            {project.contracts && project.contracts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Contractors
                </h3>
                <div className="space-y-3">
                  {project.contracts.map((contract) => (
                    <div key={contract.id} className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {contract.contractor?.name || 'N/A'}
                      </p>
                      {contract.contract_value && (
                        <p className="text-gray-600">
                          Value: ₹{(contract.contract_value / 10000000).toFixed(2)} Cr
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenders */}
            {project.tenders && project.tenders.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Tenders</h3>
                <div className="space-y-3">
                  {project.tenders.map((tender) => (
                    <div key={tender.id} className="text-sm border-b border-gray-100 pb-3 last:border-0">
                      <p className="font-semibold text-gray-900">{tender.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{tender.tender_number}</p>
                      {tender.source?.url && (
                        <a
                          href={tender.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1 mt-2"
                        >
                          View Tender
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
