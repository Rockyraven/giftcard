import { cn } from '@/lib/utils'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

const useEvent = <T extends (...args: any[]) => any>(handler: T): T => {
  const handlerRef = useRef<T | null>(null)

  useLayoutEffect(() => {
    handlerRef.current = handler
  }, [handler])

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    if (handlerRef.current === null) {
      throw new Error('Handler is not assigned')
    }
    return handlerRef.current(...args)
  }, []) as T
}

export const ResizableImageTemplate = ({ node, updateAttributes }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [editing, setEditing] = useState(false)
  const [resizingStyle, setResizingStyle] = useState<Pick<CSSProperties, 'width'> | undefined>()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditing(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [editing])

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!imgRef.current) return
      setEditing(true)
      const direction = event.currentTarget.dataset.direction || '--'
      const initialXPosition = event.type.includes('mouse')
        ? (event as React.MouseEvent<HTMLDivElement>).clientX
        : (event as React.TouchEvent<HTMLDivElement>).touches[0].clientX
      const currentWidth = imgRef.current.clientWidth
      let newWidth = currentWidth
      const transform = direction === 'w' ? -1 : 1

      const mouseMoveHandler = (event: MouseEvent | TouchEvent) => {
        event.cancelable && event.preventDefault()
        const currentPosition =
          event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
        newWidth = currentWidth + transform * (currentPosition - initialXPosition)
        setResizingStyle({ width: newWidth })
        if ('buttons' in event && !event.buttons) removeListeners()
      }

      const removeListeners = () => {
        window.removeEventListener('mousemove', mouseMoveHandler)
        window.removeEventListener('mouseup', removeListeners)
        window.removeEventListener('touchmove', mouseMoveHandler)
        window.removeEventListener('touchend', removeListeners)
        setEditing(false)
        updateAttributes({ width: newWidth })
        setResizingStyle(undefined)
      }

      window.addEventListener('mousemove', mouseMoveHandler)
      window.addEventListener('mouseup', removeListeners)
      window.addEventListener('touchmove', mouseMoveHandler, { passive: false })
      window.addEventListener('touchend', removeListeners, { passive: false })
    }
  )

  const dragCornerButton = (direction: string, className?: string) => (
    <div
      role='button'
      tabIndex={0}
      data-direction={direction}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      className={cn(
        `absolute top-1/2 h-16 w-2 -translate-y-1/2 transform rounded-md bg-secondary group-hover:bg-muted-foreground`,
        className,
        editing && 'bg-muted-foreground'
      )}
    ></div>
  )

  return (
    <NodeViewWrapper
      ref={containerRef}
      as='div'
      draggable
      data-drag-handle
      onMouseDown={() => setEditing(true)}
      onTouchStart={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      style={{
        display: 'table',
        lineHeight: '0px'
      }}
      className={`relative my-6 overflow-visible sm:my-8 ${node.attrs.align}`}
    >
      <img
        {...node.attrs}
        ref={imgRef}
        style={{
          ...resizingStyle
        }}
        alt='img'
        className={cn(
          editing && `cursor-default ring-1 ring-foreground`,
          'min-w-[200px] max-w-full rounded-md',
          node.attrs.align === 'left' && 'float-left',
          node.attrs.align === 'right' && 'float-right',
          node.attrs.align === 'center' && 'mx-auto'
        )}
      />
      <div className='group'>
        {dragCornerButton('w', '-left-3.5 cursor-w-resize')}
        {dragCornerButton('e', '-right-3.5 cursor-e-resize')}
      </div>
    </NodeViewWrapper>
  )
}
