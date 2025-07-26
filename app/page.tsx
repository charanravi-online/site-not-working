"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, CheckCircle, XCircle, Clock } from "lucide-react"

// Mock data for countries and cities
const locations = {
  "United States": ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  Singapore: ["Singapore City"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"],
}

type StatusResult = {
  country: string
  city: string
  status: "live" | "down" | "checking"
  responseTime?: number
  statusCode?: number
}

export default function WebsiteStatusChecker() {
  const [url, setUrl] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [results, setResults] = useState<StatusResult[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const availableCities = selectedCountry ? locations[selectedCountry as keyof typeof locations] || [] : []

  const checkWebsiteStatus = async () => {
    if (!url || !selectedCountry || !selectedCity) return

    setIsChecking(true)
    const newResult: StatusResult = {
      country: selectedCountry,
      city: selectedCity,
      status: "checking",
    }

    setResults((prev) => [newResult, ...prev])

    // Simulate API call to check website status
    setTimeout(() => {
      // Mock response - in real implementation, this would be a backend service
      const isLive = Math.random() > 0.3 // 70% chance of being live
      const responseTime = Math.floor(Math.random() * 500) + 50
      const statusCode = isLive ? 200 : Math.random() > 0.5 ? 404 : 500

      const updatedResult: StatusResult = {
        country: selectedCountry,
        city: selectedCity,
        status: isLive ? "live" : "down",
        responseTime,
        statusCode,
      }

      setResults((prev) => [updatedResult, ...prev.slice(1)])
      setIsChecking(false)
    }, 2000)
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedCity("") // Reset city when country changes
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">Website Status Checker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check if your website is accessible from different locations around the world
          </p>
        </div>

        {/* Main form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Check Website Status</CardTitle>
              <CardDescription>Enter a URL and select a location to test from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg py-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <Select value={selectedCountry} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(locations).map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={checkWebsiteStatus}
                disabled={!url || !selectedCountry || !selectedCity || isChecking}
                className="w-full py-3 text-lg"
              >
                {isChecking ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Website Status"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {result.status === "checking" ? (
                            <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                          ) : result.status === "live" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium text-gray-900">
                            {result.city}, {result.country}
                          </span>
                        </div>

                        <Badge
                          variant={
                            result.status === "live"
                              ? "default"
                              : result.status === "down"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {result.status === "checking" ? "Checking..." : result.status === "live" ? "Live" : "Down"}
                        </Badge>
                      </div>

                      {result.status !== "checking" && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {result.responseTime && <span>{result.responseTime}ms</span>}
                          {result.statusCode && <Badge variant="outline">{result.statusCode}</Badge>}
                        </div>
                      )}
                    </div>

                    {result.status !== "checking" && <div className="mt-2 text-sm text-gray-600">Tested: {url}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Enter URL</h3>
                  <p className="text-sm text-gray-600">Input the website URL you want to check</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Select Location</h3>
                  <p className="text-sm text-gray-600">Choose a country and city to test from</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Get Results</h3>
                  <p className="text-sm text-gray-600">See if your site is live with response times</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
