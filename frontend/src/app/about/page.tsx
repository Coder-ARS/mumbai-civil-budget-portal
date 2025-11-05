'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Target, Users, TrendingUp, Database, Code, Heart } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

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
              <span className="font-medium">Back to Map</span>
            </button>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Mumbai Civic Budget Portal</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About the Portal</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A transparent platform for tracking infrastructure projects, budgets, and civic developments across Mumbai
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Mumbai Civic Budget Portal aims to bring transparency and accessibility to Mumbai's infrastructure development. 
            We believe that citizens have the right to know how public funds are being utilized and what projects are being 
            undertaken in their city.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By providing real-time access to project information, budgets, tenders, and progress updates, we empower 
            citizens to stay informed and engaged with their city's development.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Interactive Map</h4>
            </div>
            <p className="text-gray-600">
              Visualize all infrastructure projects on an interactive map of Mumbai with real-time location markers 
              and detailed project information.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Comprehensive Database</h4>
            </div>
            <p className="text-gray-600">
              Access detailed information about projects, including budgets, contractors, tenders, timelines, 
              and progress updates.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Real-time Updates</h4>
            </div>
            <p className="text-gray-600">
              Stay informed with live dashboard statistics, project status updates, and progress tracking 
              across all municipal wards.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Citizen Engagement</h4>
            </div>
            <p className="text-gray-600">
              Share your feedback, rate projects, and participate in discussions about infrastructure 
              development in your neighborhood.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-900">Built With Modern Technology</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Frontend</h5>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Next.js 14</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• React Leaflet</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Backend</h5>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• FastAPI</li>
                <li>• Python 3.12</li>
                <li>• SQLAlchemy</li>
                <li>• PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Infrastructure</h5>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• PostGIS</li>
                <li>• OpenStreetMap</li>
                <li>• RESTful API</li>
                <li>• Real-time Data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our data is aggregated from official sources including:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Brihanmumbai Municipal Corporation (BMC) official records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Maharashtra Public Works Department</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Public tender notices and contract awards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Project progress reports and official announcements</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Join Us in Building a Transparent Mumbai</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Together, we can create a more accountable and transparent civic administration. 
            Explore projects, share feedback, and stay informed about your city's development.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Explore the Map
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 Mumbai Civic Budget Portal. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for the citizens of Mumbai</p>
        </div>
      </div>
    </div>
  );
}
