import { createClient as createBrowserClient } from "./client"

// Proposal Queries
export async function createProposal(title: string, clientName: string, description: string) {
  const supabase = createBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      user_id: user.id,
      title,
      client_name: clientName,
      description,
      status: "draft",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProposals() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("proposals").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getProposal(id: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("proposals").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function updateProposal(id: string, updates: any) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("proposals").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteProposal(id: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("proposals").delete().eq("id", id)
  if (error) throw error
}

// Sections Queries
export async function createSection(proposalId: string, type: string, title: string, content: any, orderIndex: number) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("sections")
    .insert({
      proposal_id: proposalId,
      type,
      title,
      content,
      order_index: orderIndex,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getProposalSections(proposalId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("sections").select("*").eq("proposal_id", proposalId).order("order_index")
  if (error) throw error
  return data
}

export async function updateSection(id: string, updates: any) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("sections").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteSection(id: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("sections").delete().eq("id", id)
  if (error) throw error
}

// Template Queries
export async function createTemplate(name: string, description: string, sections: any, designSettings: any) {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("templates")
    .insert({
      user_id: user.id,
      name,
      description,
      sections,
      design_settings: designSettings,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getTemplates() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("templates").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getTemplate(id: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("templates").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function deleteTemplate(id: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("templates").delete().eq("id", id)
  if (error) throw error
}

// Share Queries
export async function createShare(proposalId: string, shareToken: string, passwordHash?: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("shares")
    .insert({
      proposal_id: proposalId,
      share_token: shareToken,
      password_hash: passwordHash,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getShareByToken(token: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("shares").select("*").eq("share_token", token).single()
  if (error) throw error
  return data
}

export async function updateShareLastViewed(shareId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from("shares")
    .update({
      last_viewed_at: new Date().toISOString(),
      view_count: null, // Will increment via trigger if we add one
    })
    .eq("id", shareId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Analytics Queries
export async function recordAnalytic(
  proposalId: string,
  sectionId: string,
  eventType: string,
  viewerId: string,
  metadata?: any,
) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("analytics").insert({
    proposal_id: proposalId,
    section_id: sectionId,
    event_type: eventType,
    viewer_id: viewerId,
    metadata,
  })
  if (error) throw error
}

export async function getProposalAnalytics(proposalId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("analytics").select("*").eq("proposal_id", proposalId)
  if (error) throw error
  return data
}
