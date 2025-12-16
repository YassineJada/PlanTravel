export const dynamic = "force-dynamic";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using AI Trip Planner, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use AI Trip Planner for personal, non-commercial transitory viewing only.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The materials on AI Trip Planner are provided on an 'as is' basis. AI Trip Planner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall AI Trip Planner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use AI Trip Planner.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Accuracy of Materials</h2>
              <p className="text-gray-700 mb-4">
                The materials appearing on AI Trip Planner could include technical, typographical, or photographic errors. AI Trip Planner does not warrant that any of the materials on its website are accurate, complete or current.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. User Account</h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Modifications</h2>
              <p className="text-gray-700 mb-4">
                AI Trip Planner may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
