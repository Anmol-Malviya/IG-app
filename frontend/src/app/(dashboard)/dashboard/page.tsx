"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  FolderOpen,
  GraduationCap,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import styles from "./dashboard.module.css";

const features = [
  {
    number: "01",
    kicker: "Plan your week",
    title: "Weekly Schedule",
    description: "Classes and study blocks organized by day and time.",
    href: "/services/weekly-schedule",
    icon: CalendarDays,
    tone: "indigo",
  },
  {
    number: "02",
    kicker: "Stay on track",
    title: "Task & Assignment Track",
    description: "Deadlines, priorities, and progress in one focused queue.",
    href: "/services/assignments",
    icon: ListTodo,
    tone: "emerald",
  },
  {
    number: "03",
    kicker: "Prepare smarter",
    title: "Exam & Study Planner",
    description: "Exam dates and preparation progress without the clutter.",
    href: "/services/exam-planner",
    icon: GraduationCap,
    tone: "amber",
  },
  {
    number: "04",
    kicker: "Open faster",
    title: "Quick Links & Resources",
    description: "Keep important portals, notes, and study links one tap away.",
    href: "/services/resources",
    icon: FolderOpen,
    tone: "violet",
  },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Student";

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <Sparkles size={13} aria-hidden="true" />
            Student workspace
          </div>

          <h2 className={styles.heroTitle}>
            Welcome back, <span>{firstName}</span>.
          </h2>

          <p className={styles.heroDescription}>
            Your classes, deadlines, exams, and essential study resources — organized in one simple place.
          </p>

          <div className={styles.heroSummary}>
            <span><strong>4</strong> essential tools</span>
            <span className={styles.summaryDot} aria-hidden="true" />
            <span>Built for quick daily use</span>
          </div>
        </div>
      </section>

      <section className={styles.toolsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Core tools</span>
            <h3 className={styles.sectionTitle}>Everything you need, in one place</h3>
          </div>

          <p className={styles.sectionHint}>
            Four focused workflows designed to stay simple on mobile and productive on desktop.
          </p>
        </div>

        <div className={styles.toolGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={`${styles.toolCard} ${styles[feature.tone]}`}
              >
                <div className={styles.toolIcon}>
                  <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
                </div>

                <div className={styles.toolContent}>
                  <div className={styles.toolMeta}>
                    <span className={styles.toolNumber}>{feature.number}</span>
                    <span>{feature.kicker}</span>
                  </div>

                  <h4 className={styles.toolTitle}>{feature.title}</h4>
                  <p className={styles.toolDescription}>{feature.description}</p>
                </div>

                <div className={styles.toolArrow} aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
