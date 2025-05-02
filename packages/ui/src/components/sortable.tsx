"use client"

import type {
  DndContextProps,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  SortableContext,
  type SortableContextProps,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot, type SlotProps } from "@radix-ui/react-slot"
import * as React from "react"

import { Button, type ButtonProps } from "@repo/ui/components/button"
import { composeRefs } from "@repo/ui/lib/compose-refs"
import { cn } from "@repo/ui/lib/utils"

const orientationConfig = {
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
  },
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
  },
}

interface SortableProps<TData extends { id: UniqueIdentifier }>
  extends DndContextProps {
  /**
   * A collision detection strategy that will be used to determine the closest sortable item.
   * @default closestCenter
   * @type DndContextProps["collisionDetection"]
   */
  collisionDetection?: DndContextProps["collisionDetection"]

  /**
   * An array of modifiers that will be used to modify the behavior of the sortable component.
   * @default
   * [restrictToVerticalAxis, restrictToParentElement]
   * @type Modifier[]
   */
  modifiers?: DndContextProps["modifiers"]

  /**
   * An optional callback function that is called when an item is moved.
   * It receives an event object with `activeIndex` and `overIndex` properties, representing the original and new positions of the moved item.
   * This will override the default behavior of updating the order of the data items.
   * @type (event: { activeIndex: number; overIndex: number }) => void
   * @example
   * onMove={(event) => log(`Item moved from index ${event.activeIndex} to index ${event.overIndex}`)}
   */
  onMove?: (event: { activeIndex: number; overIndex: number }) => void

  /**
   * An optional callback function that is called when the order of the data items changes.
   * It receives the new array of items as its argument.
   * @example
   * onValueChange={(items) => log(items)}
   */
  onValueChange?: (items: TData[]) => void

  /**
   * Specifies the axis for the drag-and-drop operation. It can be "vertical", "horizontal", or "both".
   * @default "vertical"
   * @type "vertical" | "horizontal" | "mixed"
   */
  orientation?: "horizontal" | "mixed" | "vertical"

  /**
   * An optional React node that is rendered on top of the sortable component.
   * It can be used to display additional information or controls.
   * @default null
   * @type React.ReactNode | null
   * @example
   * overlay={<Skeleton className="w-full h-8" />}
   */
  overlay?: React.ReactNode | null

  /**
   * A sorting strategy that will be used to determine the new order of the data items.
   * @default verticalListSortingStrategy
   * @type SortableContextProps["strategy"]
   */
  strategy?: SortableContextProps["strategy"]

  /**
   * An array of data items that the sortable component will render.
   * @example
   * value={[
   *   { id: 1, name: 'Item 1' },
   *   { id: 2, name: 'Item 2' },
   * ]}
   */
  value: TData[]
}

function Sortable<TData extends { id: UniqueIdentifier }>({
  children,
  collisionDetection = closestCenter,
  modifiers,
  onMove,
  onValueChange,
  orientation = "vertical",
  overlay,
  strategy,
  value,
  ...props
}: SortableProps<TData>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  const config = orientationConfig[orientation]

  return (
    <DndContext
      collisionDetection={collisionDetection}
      modifiers={modifiers ?? config.modifiers}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = value.findIndex((item) => item.id === active.id)
          const overIndex = value.findIndex((item) => item.id === over.id)

          if (onMove) {
            onMove({ activeIndex, overIndex })
          } else {
            onValueChange?.(arrayMove(value, activeIndex, overIndex))
          }
        }
        setActiveId(null)
      }}
      onDragStart={({ active }) => setActiveId(active.id)}
      sensors={sensors}
      {...props}
    >
      <SortableContext items={value} strategy={strategy ?? config.strategy}>
        {children}
      </SortableContext>
      {overlay ? (
        <SortableOverlay activeId={activeId}>{overlay}</SortableOverlay>
      ) : null}
    </DndContext>
  )
}

const dropAnimationOpts: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

interface SortableOverlayProps
  extends React.ComponentPropsWithRef<typeof DragOverlay> {
  activeId?: UniqueIdentifier | null
}

const SortableOverlay = React.forwardRef<HTMLDivElement, SortableOverlayProps>(
  (
    { activeId, children, dropAnimation = dropAnimationOpts, ...props },
    ref,
  ) => {
    return (
      <DragOverlay dropAnimation={dropAnimation} {...props}>
        {activeId ? (
          <SortableItem
            asChild
            className="cursor-grabbing"
            ref={ref}
            value={activeId}
          >
            {children}
          </SortableItem>
        ) : null}
      </DragOverlay>
    )
  },
)
SortableOverlay.displayName = "SortableOverlay"

interface SortableItemContextProps {
  isDragging?: boolean
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: DraggableSyntheticListeners | undefined
}

const SortableItemContext = React.createContext<SortableItemContextProps>({
  attributes: {},
  isDragging: false,
  listeners: undefined,
})

function useSortableItem() {
  const context = React.useContext(SortableItemContext)

  if (!context) {
    throw new Error("useSortableItem must be used within a SortableItem")
  }

  return context
}

interface SortableItemProps extends SlotProps {
  /**
   * Merges the item's props into its immediate child.
   * @default false
   * @type boolean | undefined
   */
  asChild?: boolean

  /**
   * Specifies whether the item should act as a trigger for the drag-and-drop action.
   * @default false
   * @type boolean | undefined
   */
  asTrigger?: boolean

  /**
   * The unique identifier of the item.
   * @example "item-1"
   * @type UniqueIdentifier
   */
  value: UniqueIdentifier
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  ({ asChild, asTrigger, className, value, ...props }, ref) => {
    const {
      attributes,
      isDragging,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: value })

    const context = React.useMemo<SortableItemContextProps>(
      () => ({
        attributes,
        isDragging,
        listeners,
      }),
      [attributes, listeners, isDragging],
    )
    const style: React.CSSProperties = {
      opacity: isDragging ? 0.5 : 1,
      transform: CSS.Translate.toString(transform),
      transition,
    }

    const Comp = asChild ? Slot : "div"

    return (
      <SortableItemContext.Provider value={context}>
        <Comp
          className={cn(
            "data-[state=dragging]:cursor-grabbing",
            { "cursor-grab": !isDragging && asTrigger },
            className,
          )}
          data-state={isDragging ? "dragging" : undefined}
          ref={composeRefs(ref, setNodeRef as React.Ref<HTMLDivElement>)}
          style={style}
          {...(asTrigger ? attributes : {})}
          {...(asTrigger ? listeners : {})}
          {...props}
        />
      </SortableItemContext.Provider>
    )
  },
)
SortableItem.displayName = "SortableItem"

interface SortableDragHandleProps extends ButtonProps {
  withHandle?: boolean
}

const SortableDragHandle = React.forwardRef<
  HTMLButtonElement,
  SortableDragHandleProps
>(({ className, ...props }, ref) => {
  const { attributes, isDragging, listeners } = useSortableItem()

  return (
    <Button
      className={cn(
        "cursor-grab data-[state=dragging]:cursor-grabbing",
        className,
      )}
      data-state={isDragging ? "dragging" : undefined}
      ref={composeRefs(ref)}
      {...attributes}
      {...listeners}
      {...props}
    />
  )
})
SortableDragHandle.displayName = "SortableDragHandle"

export { Sortable, SortableDragHandle, SortableItem, SortableOverlay }
