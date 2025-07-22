"use client"

import { motion } from "framer-motion"
import Layout from "../../../components/Layout"
import { UserCheck, X, Check, Clock, FileText, Mail, User } from "lucide-react"
import { useState } from "react"
import { useStore } from "../../../../lib/store"
import { mockPendingAccounts } from "../../../../data/mockData"

export default function PendingAccounts() {
  const { approvePendingAccount, rejectPendingAccount } = useStore()
  const [pendingAccounts, setPendingAccounts] = useState(mockPendingAccounts)

  const handleApprove = (id: string) => {
    approvePendingAccount(id)
    setPendingAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, status: "approved" } : account)),
    )
  }

  const handleReject = (id: string) => {
    rejectPendingAccount(id)
    setPendingAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, status: "rejected" } : account)),
    )
  }

  const pendingCount = pendingAccounts.filter((account) => account.status === "pending").length
  const approvedCount = pendingAccounts.filter((account) => account.status === "approved").length
  const rejectedCount = pendingAccounts.filter((account) => account.status === "rejected").length

  return (
    <Layout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-2">Review and approve new lecturer and student registrations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-green-50 rounded-xl p-6 border border-green-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-red-50 rounded-xl p-6 border border-red-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pending Accounts */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Account Requests</h3>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        account.role === "lecturer" ? "bg-blue-100" : "bg-green-100"
                      }`}
                    >
                      <User className={`h-6 w-6 ${account.role === "lecturer" ? "text-blue-600" : "text-green-600"}`} />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{account.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{account.email}</span>
                        </div>
                        <span>•</span>
                        <span className="capitalize">{account.role}</span>
                        <span>•</span>
                        <span>{account.department}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied on {new Date(account.createdAt).toLocaleDateString()}
                      </p>

                      {account.documents && (
                        <div className="flex items-center space-x-2 mt-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{account.documents.length} document(s) attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        account.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : account.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>

                    {account.status === "pending" && (
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleApprove(account.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleReject(account.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {pendingAccounts.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pending account requests</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
