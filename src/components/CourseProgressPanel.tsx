import Link from 'next/link'

export default function CourseProgressPanel({ courses }: { courses: { id: string, title: string, progress: number }[] }) {
  return (
    <div className="glass-card w-full md:w-80 p-6 rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-lg font-bold text-cyan-200 mb-4">Your Courses</h3>
      <ul className="space-y-4">
        {courses.map(course => (
          <li key={course.id} className="flex flex-col gap-1">
            <Link href={`/courses/${course.id}`} className="font-semibold text-white hover:text-cyan-300 transition">{course.title}</Link>
            <div className="w-full bg-white/10 rounded-lg h-2 mt-1 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 h-2 rounded-lg transition-all" style={{ width: `${Math.round(course.progress * 100)}%` }} />
            </div>
            <span className="text-xs text-white/40 mt-0.5">{Math.round(course.progress * 100)}% complete</span>
          </li>
        ))}
      </ul>
      <Link href="/courses" className="block text-cyan-200 text-right mt-4 text-sm hover:underline">View all courses →</Link>
    </div>
  )
}
