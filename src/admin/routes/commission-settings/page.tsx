import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Button, Input, Label, Text } from "@medusajs/ui"

type CommissionRule = {
  id: string
  vendor_id: string | null
  category_id: string | null
  percentage: number
  flat_fee: number
  label: string | null
  is_active: boolean
}

const CommissionSettingsPage = () => {
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [newRate, setNewRate] = useState("")
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch("/admin/commission-rules", { credentials: "include" })
    const data = await res.json()
    setRules(data.commission_rules)
  }

  useEffect(() => {
    load()
  }, [])

  const globalRule = rules.find((r) => !r.vendor_id && !r.category_id && r.is_active)
  const vendorRules = rules.filter((r) => r.vendor_id && r.is_active)

  const handleSetDefault = async () => {
    if (!newRate) return
    setSaving(true)
    await fetch("/admin/commission-rules", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        percentage: Number(newRate),
        label: "Platform default",
      }),
    })
    setNewRate("")
    setSaving(false)
    load()
  }

  return (
    <Container>
      <Heading level="h1" className="mb-2">
        Commission
      </Heading>
      <Text className="text-ui-fg-subtle mb-6">
        Set what Believers Wardrobe keeps from every sale. Vendor-specific rates
        override the platform default for that vendor only.
      </Text>

      <div className="border rounded-lg p-4 mb-8 max-w-md">
        <Label>Platform default commission</Label>
        <div className="flex items-center gap-2 mt-2">
          <Text className="text-2xl font-medium">
            {globalRule ? `${globalRule.percentage}%` : "Not set"}
          </Text>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Label htmlFor="new-rate" size="small">
              New default rate (%)
            </Label>
            <Input
              id="new-rate"
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <Button onClick={handleSetDefault} disabled={saving || !newRate}>
            Save
          </Button>
        </div>
      </div>

      <Heading level="h2" className="mb-3">
        Vendor-specific overrides
      </Heading>
      {vendorRules.length === 0 ? (
        <Text className="text-ui-fg-subtle">
          No vendor has a custom commission rate yet. To set one, add a
          commission_rate on that vendor's record, or create a rule with a
          vendor_id via the API.
        </Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor ID</Table.HeaderCell>
              <Table.HeaderCell>Rate</Table.HeaderCell>
              <Table.HeaderCell>Label</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendorRules.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{r.vendor_id}</Table.Cell>
                <Table.Cell>{r.percentage}%</Table.Cell>
                <Table.Cell>{r.label ?? "—"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Commission",
})

export default CommissionSettingsPage
