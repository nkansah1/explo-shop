import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatGHS, convertUSDToGHS } from "@/lib/utils"
import { ArrowRight, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="container px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Trusted by 10,000+ customers</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                Premium Products for Modern Living
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                Discover our curated collection of high-quality products designed to enhance your lifestyle. From
                electronics to home essentials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Free shipping over {formatGHS(convertUSDToGHS(50))}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>30-day returns</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <img
                src="/modern-ecommerce-hero-products-display.png"
                alt="Featured products showcase"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-background border rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium">24/7 Support</div>
              <div className="text-xs text-muted-foreground">Always here to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
