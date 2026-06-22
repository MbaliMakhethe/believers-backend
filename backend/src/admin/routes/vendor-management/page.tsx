import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Button, Badge, Tabs, Text } from "@medusajs/ui"

type Vendor = {
  id: string
  store_name: string
  email: string
  country: string
  status: "pending" | "approved" | "rejected" | "suspended"
}

const VendorManagementPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending")
  const [loading, setLoading] = useState(true)

  const loadVendors = async (status: string) => {
    setLoading(true)
    const res = await fetch(`/admin/vendors?status=${status}`, {
      credentials: "include",
    })
    const data = await res.json()
    setVendors(data.vendors)
    setLoading(false)
  }

  useEffect(() => {
    loadVendors(tab)
  }, [tab])

  const handleApprove = async (id: string) => {
    await fetch(`/admin/vendors/${id}/approve`, {
      method: "POST",
      credentials: "include",
    })
    loadVendors(tab)
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reason for rejecting this vendor?")
    if (reason === null) return
    await fetch(`/admin/vendors/${id}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    })
    loadVendors(tab)
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h1">Vendor Applications</Heading>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <Tabs.List>
          <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
          <Tabs.Trigger value="approved">Approved</Tabs.Trigger>
          <Tabs.Trigger value="rejected">Rejected</Tabs.Trigger>
        </Tabs.List>
      </Tabs>

      {loading ? (
        <Text className="mt-4">Loading...</Text>
      ) : (
        <Table className="mt-4">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Store name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendors.map((v) => (
              <Table.Row key={v.id}>
                <Table.Cell>{v.store_name}</Table.Cell>
                <Table.Cell>{v.email}</Table.Cell>
                <Table.Cell>{v.country}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      v.status === "approved"
                        ? "green"
                        : v.status === "rejected"
                        ? "red"
                        : "orange"
                    }
                  >
                    {v.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {v.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="small" variant="primary" onClick={() => handleApprove(v.id)}>
                        Approve
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleReject(v.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
})

export default VendorManagementPage
