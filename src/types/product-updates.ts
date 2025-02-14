export interface AlertDetail {
    type: string
    source: string
    companyLinkedInUrl: string
    companyName: string
    targets: string[]
    prompt: string
  }
  
  export interface UpdateEntry {
    date: string
    isExpanded?: boolean
    preview: {
      keyTakeaway: string
      details: {
        title: string
        sections: {
          title: string
          content: string[]
        }[]
      }[]
    }
  }
  
  