import { GlassCard } from "./ui/glass-card"
import { BookOpen, Clock, Trophy, TrendingUp } from "lucide-react"

const currentCourses = [
  {
    id: 1,
    title: "Solidity Fundamentals",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    timeLeft: "2 hours",
  },
  {
    id: 2,
    title: "DeFi Protocols",
    progress: 45,
    totalLessons: 16,
    completedLessons: 7,
    timeLeft: "5 hours",
  },
  {
    id: 3,
    title: "NFT Development",
    progress: 20,
    totalLessons: 10,
    completedLessons: 2,
    timeLeft: "8 hours",
  },
]

const stats = [
  { icon: BookOpen, label: "Courses", value: "12" },
  { icon: Clock, label: "Hours", value: "48" },
  { icon: Trophy, label: "NFTs", value: "5" },
  { icon: TrendingUp, label: "Streak", value: "7d" },
]

export function CourseProgressPanel() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label} className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Current Courses */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Continue Learning</h3>
        <div className="space-y-4">
          {currentCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-medium text-sm">{course.title}</h4>
                <span className="text-xs text-white/60">{course.timeLeft}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>
                <span>{course.progress}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
