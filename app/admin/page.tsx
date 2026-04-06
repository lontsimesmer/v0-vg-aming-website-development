"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, RefreshCw, User, Phone, Calendar, MapPin, Gamepad2, ChevronDown, ChevronUp } from "lucide-react"

interface GHLLog {
  id: string
  enrollment_id: string
  webhook_url: string
  request_payload: Record<string, unknown>
  response_status: string
  response_body: string
  success: boolean
  error_message: string | null
  executed_at: string
}

interface Enrollment {
  id: string
  full_name: string
  pseudo: string | null
  birth_date: string | null
  birth_place: string | null
  how_heard: string | null
  how_heard_source: string | null
  phone: string
  level: string | null
  has_team: string | null
  categories: string | null
  language: string
  created_at: string
  ghl_execution_logs: GHLLog[]
}

export default function AdminPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedEnrollment, setExpandedEnrollment] = useState<string | null>(null)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const fetchEnrollments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/enrollment")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setEnrollments(data.enrollments || [])
    } catch (err) {
      setError("Failed to load enrollments")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">VGaming Admin</h1>
            <p className="text-sm text-muted-foreground">Enrollment History & GHL Execution Logs</p>
          </div>
          <button
            onClick={fetchEnrollments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-primary">{enrollments.length}</div>
            <div className="text-sm text-muted-foreground">Total Enrollments</div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-green-500">
              {enrollments.filter(e => e.ghl_execution_logs.some(l => l.success)).length}
            </div>
            <div className="text-sm text-muted-foreground">Successful GHL Syncs</div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-red-500">
              {enrollments.filter(e => e.ghl_execution_logs.every(l => !l.success)).length}
            </div>
            <div className="text-sm text-muted-foreground">Failed GHL Syncs</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Loading enrollments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Enrollments Yet</h3>
            <p className="text-muted-foreground">Enrollments will appear here once users register.</p>
          </div>
        )}

        {/* Enrollment List */}
        {!loading && !error && enrollments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Enrollment History</h2>
            
            {enrollments.map((enrollment) => {
              const latestLog = enrollment.ghl_execution_logs[0]
              const isExpanded = expandedEnrollment === enrollment.id

              return (
                <div
                  key={enrollment.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Enrollment Header */}
                  <button
                    onClick={() => setExpandedEnrollment(isExpanded ? null : enrollment.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{enrollment.full_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {enrollment.phone}
                          {enrollment.pseudo && (
                            <span className="text-primary">@{enrollment.pseudo}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(enrollment.created_at)}
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          {latestLog?.success ? (
                            <span className="flex items-center gap-1 text-green-500 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              GHL Synced
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 text-sm">
                              <XCircle className="w-4 h-4" />
                              GHL Failed
                            </span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {/* Enrollment Details */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Birth Date:</span>{" "}
                            {enrollment.birth_date || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Birth Place:</span>{" "}
                            {enrollment.birth_place || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Level:</span>{" "}
                            {enrollment.level || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            <span className="text-muted-foreground">Has Team:</span>{" "}
                            {enrollment.has_team || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            <span className="text-muted-foreground">Categories:</span>{" "}
                            {enrollment.categories || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            <span className="text-muted-foreground">How Heard:</span>{" "}
                            {enrollment.how_heard || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* GHL Execution Logs */}
                      <div className="p-4 border-t border-border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          GHL Execution Logs
                        </h4>
                        
                        {enrollment.ghl_execution_logs.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No execution logs</p>
                        ) : (
                          <div className="space-y-2">
                            {enrollment.ghl_execution_logs.map((log) => {
                              const isLogExpanded = expandedLog === log.id

                              return (
                                <div
                                  key={log.id}
                                  className={`rounded-lg border ${
                                    log.success
                                      ? "border-green-500/30 bg-green-500/5"
                                      : "border-red-500/30 bg-red-500/5"
                                  }`}
                                >
                                  <button
                                    onClick={() => setExpandedLog(isLogExpanded ? null : log.id)}
                                    className="w-full p-3 flex items-center justify-between text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      {log.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                      )}
                                      <div>
                                        <div className="text-sm font-medium">
                                          Status: {log.response_status}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {formatDate(log.executed_at)}
                                        </div>
                                      </div>
                                    </div>
                                    {isLogExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>

                                  {isLogExpanded && (
                                    <div className="px-3 pb-3 space-y-2">
                                      <div>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Webhook URL:
                                        </div>
                                        <code className="text-xs bg-background/50 px-2 py-1 rounded block overflow-x-auto">
                                          {log.webhook_url}
                                        </code>
                                      </div>
                                      
                                      {log.error_message && (
                                        <div>
                                          <div className="text-xs text-red-400 mb-1">
                                            Error Message:
                                          </div>
                                          <code className="text-xs bg-red-500/10 px-2 py-1 rounded block text-red-400">
                                            {log.error_message}
                                          </code>
                                        </div>
                                      )}

                                      <div>
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Request Payload:
                                        </div>
                                        <pre className="text-xs bg-background/50 px-2 py-1 rounded overflow-x-auto max-h-40 overflow-y-auto">
                                          {JSON.stringify(log.request_payload, null, 2)}
                                        </pre>
                                      </div>

                                      {log.response_body && (
                                        <div>
                                          <div className="text-xs text-muted-foreground mb-1">
                                            Response Body:
                                          </div>
                                          <code className="text-xs bg-background/50 px-2 py-1 rounded block overflow-x-auto">
                                            {log.response_body}
                                          </code>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
