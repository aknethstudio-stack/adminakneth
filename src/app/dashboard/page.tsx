export default function Dashboard() {
  return (
    <div className="p-8">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: 'var(--color-body-text)' }}
      >
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: 'var(--color-light)' }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--color-body-text)' }}
          >
            Active Sessions
          </h2>
          <p
            className="text-3xl font-bold"
            style={{ color: 'var(--color-secondary)' }}
          >
            89
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: 'var(--color-light)' }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--color-body-text)' }}
          >
            System Status
          </h2>
          <p
            className="text-3xl font-bold"
            style={{ color: 'var(--color-link)' }}
          >
            Online
          </p>
        </div>
      </div>
    </div>
  )
}
