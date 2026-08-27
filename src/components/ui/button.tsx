import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Sem border-radius em nenhuma variante — a linguagem do design é de cantos
 * retos. As variantes cobrem os dois botões do protótipo: sólido e contorno.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[9px] font-sans font-bold transition-colors duration-[180ms] ease-out",
  {
    variants: {
      variant: {
        solid: "bg-accent text-white hover:bg-accent-hover",
        outline:
          "border border-white/28 text-text hover:bg-white/10 hover:border-white",
      },
      size: {
        sm: "px-[15px] py-[10px] text-xs tracking-[0.04em]",
        md: "px-[26px] py-[17px] text-[15px]",
        lg: "px-[26px] py-[18px] text-[15px]",
        block:
          "w-full gap-[11px] px-[clamp(20px,3vw,34px)] py-[clamp(19px,3vw,25px)] text-[clamp(14px,2.4vw,17px)] hover:-translate-y-0.5 transition-[background-color,transform] duration-[180ms]",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
