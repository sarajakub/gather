'use client';

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function PostPage() {
  return (
    <main className="app-shell">
      <div className="app-frame app-frame-narrow">
        <section className="surface-card app-empty-panel">
          <p className="eyebrow">Post a need</p>
          <h1 className="section-heading section-heading-large">Create a Post</h1>
          <p className="muted-copy app-empty-copy">
            Post creation is coming soon. The final flow will help you describe a
            need clearly, choose a good time, and share it with neighbors nearby.
          </p>
          <div className="app-empty-actions">
            <Link href="/home" className="btn btn-secondary btn-md">
              Back to home
            </Link>
            <Link href="/profile" className="btn btn-ghost btn-md">
              Review profile
            </Link>
          </div>
        </section>
      </div>

      <BottomNav activeTab="feed" hasNotification={true} />
    </main>
  );
}
