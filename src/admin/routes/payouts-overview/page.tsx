import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Badge, Button, Text } from "@medusajs/ui"

type Payout = {
  id: string
  vendor: { id: string; store_name: string } | null
  gross_amount: number
  commission_amount: number
  net_amount: number
  currency_code: string
  status: "pending" | "processing" | "paid" | "failed"
  failure_reason: string | null
  paid_at: string | null
}

const formatMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)

const PayoutsOverviewPage = () => {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch("/admin/payouts", { credentials: "include" })
    const data = await res.json()
    setPayouts(data.payouts)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleRunAll = async () => {
    setRunning(true)
    const periodEnd = new Date()
    const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
    await fetch("/admin/payouts/run", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      }),
    })
    setRunning(false)
    load()
  }

  const handleMarkPaid = async (id: string) => {
    await fetch(`/admin/payouts/${id}/mark-paid`, {
      method: "POST",
      credentials: "include",
    })
    load()
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Payouts</Heading>
          <Text className="text-ui-fg-subtle">
            Vendor earnings, net of commission, transferred via Stripe Connect.
          </Text>
        </div>
        <Button onClick={handleRunAll} disabled={running}>
          {running ? "Running..." : "Run payouts for all vendors"}
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell>Gross</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
              <Table.HeaderCell>Net paid</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {payouts.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>{p.vendor?.store_name ?? p.vendor?.id ?? "—"}</Table.Cell>
                <Table.Cell>{formatMoney(p.gross_amount, p.currency_code)}</Table.Cell>
                <Table.Cell>{formatMoney(p.commission_amount, p.currency_code)}</Table.Cell>
                <Table.Cell>{formatMoney(p.net_amount, p.currency_code)}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      p.status === "paid"
                        ? "green"
                        : p.status === "failed"
                        ? "red"
                        : "orange"
                    }
                  >
                    {p.status}
                  </Badge>
                  {p.status === "failed" && p.failure_reason && (
                    <Text size="small" className="text-ui-fg-subtle mt-1">
                      {p.failure_reason}
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {p.status === "failed" && (
                    <Button size="small" variant="secondary" onClick={() => handleMarkPaid(p.id)}>
                      Mark paid manually
                    </Button>
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
  label: "Payouts",
})

export default PayoutsOverviewPage
