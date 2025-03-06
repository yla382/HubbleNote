import {
  ActionButtonsRow,
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar
} from "@/components"
import { useRef } from "react"
import { MarkdownRenderView } from "./components/MarkdownRenderView"

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonsRow className="flex justify-between mt-1"/>
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll}/>
        </Sidebar>
        <Content ref={contentContainerRef} className="border-l bg-zinc-900/50 border-l-white/20 flex flex-col h-screen">
          {/* FloatingNoteTitle stays fixed at the top */}
          <div className="sticky top-0 bg-zinc-900/50 z-10 pb-2">
            <FloatingNoteTitle />
          </div>

          {/* Scrollable container for MarkdownEditor and MarkdownRenderView */}
          <div className="flex gap-2 flex-1 overflow-hidden">
            <div className="w-1/2">
              <MarkdownEditor className="w-full h-full overflow-auto"/>
            </div>
            <div className="w-1/2">
              <MarkdownRenderView className="w-full h-full bg-zinc-900/80 overflow-auto"/>
            </div>
          </div>
        </Content>
      </RootLayout>
    </>
  )
}

export default App
