import * as React from "react"

import { cn } from "@repo/ui/lib/utils"

export interface FancySwitchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: null | string
  radioClassName?: string
  activeClassName?: string
  onChange?: (value: string) => void
  options: { content: React.ReactNode; label: string }[]
}

export type OptionRefs = {
  [key: string]: HTMLDivElement | null
}

const FancySwitch = React.forwardRef<HTMLDivElement, FancySwitchProps>(
  (
    {
      activeClassName,
      className,
      onChange,
      options,
      radioClassName,
      value,
      ...props
    },
    ref,
  ) => {
    const [selectedOption, setSelectedOption] = React.useState(
      value ?? options[0]?.label,
    )
    const [highlighterStyle, setHighlighterStyle] = React.useState({
      height: 0,
      transform: "translateX(0)",
      width: 0,
    })
    const containerRef = React.useRef<HTMLDivElement>(null)
    const optionRefs = React.useRef<OptionRefs>({})

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const updateToggle = React.useCallback(() => {
      const selectedElement = optionRefs.current[selectedOption!]

      if (selectedElement && containerRef.current) {
        const selectedElementPosition = selectedElement.getBoundingClientRect()
        const containerPosition = containerRef.current.getBoundingClientRect()

        const x = Math.max(
          selectedElementPosition.left - containerPosition.left,
          0,
        )

        setHighlighterStyle({
          height: selectedElementPosition.height,
          width: selectedElementPosition.width,

          // or just use left-0
          transform: "translateX(" + x + "px)",
        })
      }
    }, [selectedOption])

    React.useEffect(() => {
      updateToggle()
    }, [updateToggle])

    const handleOptionChange = (option: string) => {
      setSelectedOption(option)
      if (onChange) onChange(option)
    }

    return (
      <div className={cn("", className)} ref={containerRef} {...props}>
        <div className="relative flex rounded-full bg-muted/20  backdrop-blur-xs  ">
          <div
            className={cn(
              "absolute  rounded-full bg-primary transition-all duration-300",
              activeClassName,
            )}
            style={highlighterStyle}
          />
          {options.map((option) => (
            <div
              aria-checked={selectedOption === option.label}
              aria-label={option.label}
              className={cn(
                "relative flex cursor-pointer items-center rounded-full p-2  text-center text-xs font-medium transition-colors duration-200",
                { "text-primary-foreground": selectedOption === option.label },
                radioClassName,
              )}
              key={option.label}
              onClick={() => handleOptionChange(option.label)}
              onKeyDown={() => handleOptionChange(option.label)}
              ref={(el) => {
                if (el) optionRefs.current[option.label] = el
              }}
              role="radio"
              tabIndex={0}
            >
              {option.content}
            </div>
          ))}
        </div>
      </div>
    )
  },
)

FancySwitch.displayName = "FancySwitch"

export { FancySwitch }
