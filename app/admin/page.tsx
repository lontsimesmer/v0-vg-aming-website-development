"use client";

import { Fragment, useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  Phone,
  Calendar,
  MapPin,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchWithTimeout } from "@/lib/supabase/client-config";

interface GHLLog {
  id: string;
  enrollment_id: string;
  webhook_url: string;
  request_payload: Record<string, unknown>;
  response_status: string;
  response_body: string;
  success: boolean;
  error_message: string | null;
  executed_at: string;
}
interface Enrollment {
  id: string;
  full_name: string;
  pseudo: string | null;
  birth_date: string | null;
  birth_place: string | null;
  how_heard: string | null;
  how_heard_source: string | null;
  phone: string;
  level: string | null;
  has_team: string | null;
  categories: string | null;
  language: string;
  photo_url: string | null;
  created_at: string;
  ghl_execution_logs: GHLLog[];
}

interface EnrollmentStats {
  totalEnrollments: number;
  successfulSyncs: number;
  failedSyncs: number;
}

type StatusFilter = "all" | "successful" | "failed" | "pending";

export default function AdminPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEnrollment, setExpandedEnrollment] = useState<string | null>(
    null,
  );
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 50,
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [editForm, setEditForm] = useState<Partial<Enrollment>>({});

  const getEnrollmentStatus = (enrollment: Enrollment) => {
    const latestLog = enrollment.ghl_execution_logs[0];
    if (!latestLog) {
      return "pending" as const;
    }
    return latestLog.success ? "successful" : "failed";
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const status = getEnrollmentStatus(enrollment);
    return statusFilter === "all" || status === statusFilter;
  });

  const pageStats = {
    totalEnrollments: pagination.total,
    successfulSyncs: enrollments.filter(
      (enrollment) => getEnrollmentStatus(enrollment) === "successful",
    ).length,
    failedSyncs: enrollments.filter(
      (enrollment) => getEnrollmentStatus(enrollment) === "failed",
    ).length,
    pendingEnrollments: enrollments.filter(
      (enrollment) => getEnrollmentStatus(enrollment) === "pending",
    ).length,
  };

  const isAllSelected =
    filteredEnrollments.length > 0 &&
    filteredEnrollments.every((enrollment) =>
      selectedIds.includes(enrollment.id),
    );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredEnrollments.map((enrollment) => enrollment.id));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const fetchEnrollments = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchWithTimeout(
        `/api/enrollment?page=${pageNum}&limit=50`,
        { method: "GET" },
        30000, // 30 second timeout
      );
      if (!response.ok) {
        let errorDetail = "Failed to fetch enrollments";
        try {
          const errorResponse = await response.json();
          errorDetail = errorResponse.error || errorDetail;
        } catch {
          // If parsing fails, keep default error message
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();

      if (!data.enrollments || !Array.isArray(data.enrollments)) {
        throw new Error(
          "Invalid response format: enrollments array is missing",
        );
      }
      setEnrollments(data.enrollments);
      setPagination(data.pagination || { total: 0, totalPages: 0, limit: 50 });
      setPage(pageNum);
      setSelectedIds([]);
      setEditingEnrollment(null);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.name === "AbortError"
          ? "Request timeout - server took too long to respond"
          : err instanceof Error
            ? err.message
            : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const queryString = selectedIds
        .map((id) => `id=${encodeURIComponent(id)}`)
        .join("&");
      const response = await fetch(`/api/enrollment?${queryString}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to delete enrollments");
      }

      setEnrollments((current) =>
        current.filter((enrollment) => !selectedIds.includes(enrollment.id)),
      );
      setSelectedIds([]);
      setEditingEnrollment(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete selected rows",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSelected = () => {
    if (selectedIds.length !== 1) {
      setError("Select exactly one row to edit.");
      return;
    }
    const enrollment = enrollments.find((item) => item.id === selectedIds[0]);
    if (!enrollment) {
      setError("Selected enrollment not found.");
      return;
    }
    setEditingEnrollment(enrollment);
    setEditForm({
      full_name: enrollment.full_name,
      phone: enrollment.phone,
      level: enrollment.level,
      has_team: enrollment.has_team,
      categories: enrollment.categories,
      language: enrollment.language,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingEnrollment) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/enrollment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingEnrollment.id, ...editForm }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update enrollment");
      }

      const data = await response.json();
      if (data.enrollment) {
        setEnrollments((current) =>
          current.map((item) =>
            item.id === data.enrollment.id
              ? { ...item, ...data.enrollment }
              : item,
          ),
        );
      }
      setEditingEnrollment(null);
      setSelectedIds([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEnrollment(null);
    setEditForm({});
  };

  const handleDeleteRow = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/enrollment?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to delete enrollment");
      }
      setEnrollments((current) =>
        current.filter((enrollment) => enrollment.id !== id),
      );
      setSelectedIds((current) =>
        current.filter((selectedId) => selectedId !== id),
      );
      if (editingEnrollment?.id === id) {
        setEditingEnrollment(null);
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete enrollment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditRow = (enrollment: Enrollment) => {
    setSelectedIds([enrollment.id]);
    setEditingEnrollment(enrollment);
    setEditForm({
      full_name: enrollment.full_name,
      phone: enrollment.phone,
      level: enrollment.level,
      has_team: enrollment.has_team,
      categories: enrollment.categories,
      language: enrollment.language,
    });
  };

  useEffect(() => {
    fetchEnrollments(1);
  }, []);

  // Pagination controls in JSX (add after stats section)
  const renderPaginationControls = () => (
    <div className="flex items-center justify-between mb-6 px-4 py-3 bg-card rounded-lg border border-border">
      <div className="text-sm text-muted-foreground">
        Showing {enrollments.length > 0 ? (page - 1) * pagination.limit + 1 : 0}{" "}
        to {Math.min(page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} enrollments
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => fetchEnrollments(page - 1)}
          disabled={page === 1 || loading}
          className="px-3 py-1 bg-primary text-secondary rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-sm">
          Page {page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => fetchEnrollments(page + 1)}
          disabled={page >= pagination.totalPages || loading}
          className="px-3 py-1 bg-primary text-secondary rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">VGaming Admin</h1>
            <p className="text-sm text-muted-foreground">
              Enrollment History & GHL Execution Logs
            </p>
          </div>
          <button
            onClick={() => fetchEnrollments()}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-primary">
              {pageStats.totalEnrollments}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Enrollments
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-green-500">
              {pageStats.successfulSyncs}
            </div>
            <div className="text-sm text-muted-foreground">
              Successful GHL Syncs
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-red-500">
              {pageStats.failedSyncs}
            </div>
            <div className="text-sm text-muted-foreground">
              Failed GHL Syncs
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-3xl font-bold text-amber-500">
              {pageStats.pendingEnrollments}
            </div>
            <div className="text-sm text-muted-foreground">
              Pending Enrollments
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {(["all", "successful", "failed", "pending"] as StatusFilter[]).map(
              (filter) => {
                const label =
                  filter === "all"
                    ? "All"
                    : filter === "successful"
                      ? "Successful"
                      : filter === "failed"
                        ? "Failed"
                        : "Pending";
                const active = statusFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm border transition ${active ? "bg-primary text-secondary border-primary" : "bg-card text-foreground border-border hover:bg-muted"}`}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <button
                type="button"
                onClick={handleEditSelected}
                disabled={selectedIds.length !== 1 || loading}
                className="rounded-lg px-4 py-2 text-sm border border-border bg-background hover:bg-muted disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={loading}
                className="rounded-lg px-4 py-2 text-sm border border-border bg-background text-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Add pagination controls */}
        {!loading &&
          !error &&
          enrollments.length > 0 &&
          renderPaginationControls()}

        {editingEnrollment && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Edit Enrollment</h2>
                <p className="text-sm text-muted-foreground">
                  Update the selected enrollment record and save changes.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-secondary hover:bg-primary/90 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Full Name</span>
                <input
                  type="text"
                  value={editForm.full_name ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      full_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Phone</span>
                <input
                  type="text"
                  value={editForm.phone ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Level</span>
                <input
                  type="text"
                  value={editForm.level ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      level: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Category</span>
                <input
                  type="text"
                  value={editForm.categories ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      categories: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Has Team</span>
                <input
                  type="text"
                  value={editForm.has_team ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      has_team: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Language</span>
                <input
                  type="text"
                  value={editForm.language ?? ""}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      language: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>
        )}

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
            <p className="text-muted-foreground">
              Enrollments will appear here once users register.
            </p>
          </div>
        )}

        {/* Enrollment Table */}
        {!loading && !error && enrollments.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Enrollment History
                </h2>
                <p className="text-sm text-muted-foreground">
                  View all enrollment records, GHL sync status, and user
                  details.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchEnrollments(page)}
                  disabled={loading}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted/70"
                >
                  Refresh Table
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Pseudo</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>GHL Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => {
                    const latestLog = enrollment.ghl_execution_logs[0];
                    const isExpanded = expandedEnrollment === enrollment.id;
                    const statusText = latestLog
                      ? latestLog.success
                        ? "Synced"
                        : "Failed"
                      : "Pending";
                    const statusClass = latestLog
                      ? latestLog.success
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-muted-foreground";
                    const isSelected = selectedIds.includes(enrollment.id);

                    return (
                      <Fragment key={enrollment.id}>
                        <TableRow
                          className={`cursor-pointer ${
                            isSelected ? "bg-muted/20" : ""
                          }`}
                          onClick={() =>
                            setExpandedEnrollment(
                              isExpanded ? null : enrollment.id,
                            )
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleSelectRow(enrollment.id)
                              }
                              onClick={(event) => event.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {enrollment.full_name}
                          </TableCell>
                          <TableCell>{enrollment.pseudo || "—"}</TableCell>
                          <TableCell>{enrollment.phone}</TableCell>
                          <TableCell>{enrollment.level || "—"}</TableCell>
                          <TableCell>{enrollment.has_team || "—"}</TableCell>
                          <TableCell>{enrollment.categories || "—"}</TableCell>
                          <TableCell>{enrollment.language}</TableCell>
                          <TableCell>
                            {formatDate(enrollment.created_at)}
                          </TableCell>
                          <TableCell className={statusClass}>
                            {statusText}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEditRow(enrollment);
                                }}
                                className="rounded-lg p-2 border border-border bg-background hover:bg-muted"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeleteRow(enrollment.id);
                                }}
                                className="rounded-lg p-2 border border-border bg-background hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow>
                            <TableCell
                              colSpan={11}
                              className="bg-muted/20 px-4 py-4"
                            >
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Birth Date
                                  </div>
                                  <div>{enrollment.birth_date || "N/A"}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Birth Place
                                  </div>
                                  <div>{enrollment.birth_place || "N/A"}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    How Heard
                                  </div>
                                  <div>{enrollment.how_heard || "N/A"}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    How Heard Source
                                  </div>
                                  <div>
                                    {enrollment.how_heard_source || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Photo Attached
                                  </div>
                                  <div>
                                    {enrollment.photo_url ? "Yes" : "No"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    GHL Status
                                  </div>
                                  <div className={statusClass}>
                                    {statusText}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 border-t border-border pt-4">
                                <h3 className="text-sm font-semibold mb-3">
                                  GHL Execution Logs
                                </h3>
                                {enrollment.ghl_execution_logs.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No execution logs available for this
                                    enrollment.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {enrollment.ghl_execution_logs.map(
                                      (log) => {
                                        const isLogExpanded =
                                          expandedLog === log.id;

                                        return (
                                          <div
                                            key={log.id}
                                            className={`rounded-lg border p-3 ${
                                              log.success
                                                ? "border-green-500/30 bg-green-500/5"
                                                : "border-red-500/30 bg-red-500/5"
                                            }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setExpandedLog(
                                                  isLogExpanded ? null : log.id,
                                                )
                                              }
                                              className="w-full flex items-center justify-between gap-4 text-left"
                                            >
                                              <div className="flex items-center gap-3">
                                                {log.success ? (
                                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                  <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                <div>
                                                  <div className="text-sm font-medium">
                                                    {log.success
                                                      ? "Success"
                                                      : "Failed"}
                                                    {` • ${log.response_status}`}
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                      log.executed_at,
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="text-muted-foreground">
                                                {isLogExpanded
                                                  ? "Hide"
                                                  : "Details"}
                                              </span>
                                            </button>

                                            {isLogExpanded && (
                                              <div className="mt-3 space-y-3 text-sm">
                                                <div>
                                                  <div className="text-xs text-muted-foreground mb-1">
                                                    Webhook URL
                                                  </div>
                                                  <code className="block w-full overflow-x-auto rounded bg-background/80 px-2 py-1">
                                                    {log.webhook_url}
                                                  </code>
                                                </div>
                                                {log.error_message && (
                                                  <div>
                                                    <div className="text-xs text-red-400 mb-1">
                                                      Error Message
                                                    </div>
                                                    <code className="block w-full overflow-x-auto rounded bg-red-500/10 px-2 py-1 text-red-400">
                                                      {log.error_message}
                                                    </code>
                                                  </div>
                                                )}
                                                <div>
                                                  <div className="text-xs text-muted-foreground mb-1">
                                                    Request Payload
                                                  </div>
                                                  <pre className="max-h-40 overflow-y-auto rounded bg-background/80 p-2 text-xs">
                                                    {JSON.stringify(
                                                      log.request_payload,
                                                      null,
                                                      2,
                                                    )}
                                                  </pre>
                                                </div>
                                                {log.response_body && (
                                                  <div>
                                                    <div className="text-xs text-muted-foreground mb-1">
                                                      Response Body
                                                    </div>
                                                    <code className="block w-full overflow-x-auto rounded bg-background/80 px-2 py-1 text-xs">
                                                      {log.response_body}
                                                    </code>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
