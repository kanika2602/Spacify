
import React from 'react';
import { BookOpen, Code, Database, Zap, Globe, ShieldCheck, CreditCard, MessageSquare } from 'lucide-react';

const RoadmapStep = ({ title, description, icon: Icon, color }: { title: string, description: string, icon: any, color: string }) => (
  <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all">
    <div className={`p-3 rounded-lg h-fit ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

const RoadmapView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">ConsignSpace Master Roadmap</h1>
        <p className="text-slate-500 mt-2">Your 12-week guide to building a production-grade logistics marketplace.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoadmapStep 
          title="Phase 1: Foundation (Weeks 1-2)" 
          description="Master React, TypeScript, and Tailwind CSS. Learn UI/UX principles for enterprise apps. Build responsive layouts and state-driven components."
          icon={Code}
          color="bg-blue-500"
        />
        <RoadmapStep 
          title="Phase 2: Backend & Database (Weeks 3-5)" 
          description="Node.js/Express for APIs. MongoDB or PostgreSQL for data. Design schemas for Users, Containers, Bookings, and Transcriptions."
          icon={Database}
          color="bg-emerald-500"
        />
        <RoadmapStep 
          title="Phase 3: Auth & RBAC (Week 6)" 
          description="JWT based authentication. Implement Middleware for Role-Based Access Control (Admin vs Provider vs Trader). Secure routes."
          icon={ShieldCheck}
          color="bg-purple-500"
        />
        <RoadmapStep 
          title="Phase 4: Real-time Communication (Week 7-8)" 
          description="Socket.io for chat and live container updates. Implement push notifications and real-time dashboard analytics."
          icon={MessageSquare}
          color="bg-orange-500"
        />
        <RoadmapStep 
          title="Phase 5: Payments & Flows (Week 9-10)" 
          description="Integrate Stripe/Razorpay. Handle webhooks, success/failure states, and generate digital invoices/bills of lading."
          icon={CreditCard}
          color="bg-pink-500"
        />
        <RoadmapStep 
          title="Phase 6: AI & ML Integration (Week 11)" 
          description="Use Gemini API for price prediction and cargo volume optimization. Add an AI assistant for export documentation help."
          icon={Zap}
          color="bg-yellow-500"
        />
        <RoadmapStep 
          title="Phase 7: Testing & Deployment (Week 12)" 
          description="Unit testing with Vitest. Deploy on Vercel (Frontend) and Render/Fly.io (Backend). Setup CI/CD with GitHub Actions."
          icon={Globe}
          color="bg-cyan-500"
        />
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-3xl mt-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen /> Tech Stack Recommendation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-indigo-100">
          <div>
            <h4 className="font-semibold text-white mb-2">Frontend</h4>
            <ul className="text-sm space-y-1">
              <li>• React (Next.js preferred)</li>
              <li>• Tailwind CSS</li>
              <li>• Shadcn UI / Lucide</li>
              <li>• React Query (TanStack)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Backend</h4>
            <ul className="text-sm space-y-1">
              <li>• Node.js / Express</li>
              <li>• Socket.io</li>
              <li>• Zod (Validation)</li>
              <li>• Winston (Logging)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Database</h4>
            <li>• PostgreSQL (Supabase)</li>
            <li>• Redis (Caching)</li>
            <li>• Prisma (ORM)</li>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">DevOps</h4>
            <li>• Docker</li>
            <li>• GitHub Actions</li>
            <li>• Sentry (Monitoring)</li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;
export { RoadmapView };
