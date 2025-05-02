"use client"

import { Command as CommandPrimitive } from "cmdk"
import { Check, X as RemoveIcon } from "lucide-react"
import type { KeyboardEvent } from "react"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react"

import { Badge } from "@repo/ui/components/badge"
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command"
import { cn } from "@repo/ui/lib/utils"

interface MultiSelectorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  loop?: boolean
  values: string[]
  onValuesChange: (value: string[]) => void
}

interface MultiSelectContextProps {
  open: boolean
  value: string[]
  inputValue: string
  activeIndex: number
  setOpen: (value: boolean) => void
  onValueChange: (value: any) => void
  ref: React.RefObject<HTMLInputElement | null>
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null)

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider")
  }
  return context
}

/**
 * MultiSelect Docs: {@link: https://shadcn-extension.vercel.app/docs/multi-select}
 */

// TODO : expose the visibility of the popup

const MultiSelector = ({
  children,
  className,
  dir,
  loop = false,
  onValuesChange: onValueChange,
  values: value,
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isValueSelected, setIsValueSelected] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState("")

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (value.includes(val)) {
        onValueChange(value.filter((item) => item !== val))
      } else {
        onValueChange([...value, val])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, onValueChange],
  )

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      e.preventDefault()
      const target = e.currentTarget
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0,
      )

      setSelectedValue(selection)
      setIsValueSelected(selection === inputValue)
    },
    [inputValue],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const target = inputRef.current

      if (!target) return

      const moveNext = () => {
        const nextIndex = activeIndex + 1
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
        )
      }

      const movePrev = () => {
        const prevIndex = activeIndex - 1
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex)
      }

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1
        setActiveIndex(newIndex)
      }

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext()
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev()
            }
          }
          break

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev()
            }
          } else {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext()
            }
          }
          break

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex]!)
              moveCurrent()
            } else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  onValueChangeHandler(value[value.length - 1]!)
                }
              }
            }
          }
          break

        case "Enter":
          setOpen(true)
          break

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1)
          } else if (open) {
            setOpen(false)
          }
          break
      }
    },
    [
      value,
      inputValue,
      activeIndex,
      dir,
      isValueSelected,
      onValueChangeHandler,
      loop,
      selectedValue,
      open,
    ],
  )

  return (
    <MultiSelectContext.Provider
      value={{
        activeIndex,
        handleSelect,
        inputValue,
        onValueChange: onValueChangeHandler,
        open,
        ref: inputRef,
        setActiveIndex,
        setInputValue,
        setOpen,
        value,
      }}
    >
      <Command
        className={cn(
          "flex flex-col  overflow-visible bg-transparent",
          className,
        )}
        dir={dir}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  )
}

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { activeIndex, onValueChange, value } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "border border-secondary/50 bg-transparent transition hover:bg-accent hover:text-accent-foreground": true,
        },
        className,
      )}
      ref={ref}
      {...props}
    >
      {value.map((item, index) => (
        <Badge
          className={cn(
            "flex items-center gap-1 rounded-xl px-1",
            activeIndex === index && "ring-2 ring-muted-foreground ",
          )}
          key={item}
          variant="secondary"
        >
          <span className="text-xs">{item}</span>
          <button
            aria-label={`Remove ${item} option`}
            aria-roledescription="button to remove option"
            onClick={() => onValueChange(item)}
            onMouseDown={mousePreventDefault}
            type="button"
          >
            <span className="sr-only">Remove {item} option</span>
            <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
          </button>
        </Badge>
      ))}
      {children}
    </div>
  )
})

MultiSelectorTrigger.displayName = "MultiSelectorTrigger"

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const {
    activeIndex,
    handleSelect,
    inputValue,
    ref: inputRef,
    setActiveIndex,
    setInputValue,
    setOpen,
  } = useMultiSelect()

  return (
    <CommandPrimitive.Input
      {...props}
      className={cn(
        "ml-2 flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground",
        className,
        activeIndex !== -1 && "caret-transparent",
      )}
      onBlur={() => setOpen(false)}
      onClick={() => setActiveIndex(-1)}
      onFocus={() => setOpen(true)}
      onSelect={handleSelect}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      ref={inputRef}
      tabIndex={0}
      value={inputValue}
    />
  )
})

MultiSelectorInput.displayName = "MultiSelectorInput"

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect()
  return (
    <div className="relative" ref={ref}>
      {open && children}
    </div>
  )
})

MultiSelectorContent.displayName = "MultiSelectorContent"

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ children, className }, ref) => {
  return (
    <CommandList
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg absolute top-0 z-10 flex w-full flex-col gap-2 rounded-md border border-muted bg-background p-2 shadow-md transition-colors",
        className,
      )}
      ref={ref}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">No results found</span>
      </CommandEmpty>
    </CommandList>
  )
})

MultiSelectorList.displayName = "MultiSelectorList"

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ children, className, value, ...props }, ref) => {
  const { onValueChange, setInputValue, value: Options } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const isIncluded = Options.includes(value)
  return (
    <CommandItem
      ref={ref}
      {...props}
      className={cn(
        "flex cursor-pointer justify-between rounded-md px-2 py-1 transition-colors ",
        className,
        isIncluded && "cursor-default opacity-50",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
      onMouseDown={mousePreventDefault}
      onSelect={() => {
        onValueChange(value)
        setInputValue("")
      }}
    >
      {children}
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  )
})

MultiSelectorItem.displayName = "MultiSelectorItem"

export {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
}
