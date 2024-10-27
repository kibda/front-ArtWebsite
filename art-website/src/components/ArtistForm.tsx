'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axios from 'axios'

type FormData = {
  name: string
  biography: string
  dateOfBirth: Date
  countryOfOrigin: string
  style: string
}



export default function ArtistForm() {
  const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FormData>()
  const [date, setDate] = useState<Date>()

  const onSubmit = async (data: FormData) => {
    // Convert date to ISO string for easier API handling
    const formattedData = {
      ...data,
      date_of_birth: data.dateOfBirth.toISOString().split('T')[0] // YYYY-MM-DD format
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/artists/create/', formattedData)

      if (response.data.message === "Artist created successfully!") {
        console.log("Artist created successfully!")
      } else {
        console.error("Erreur: ", response.data)
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto ">
      <CardHeader>
        <CardTitle>Add New Artist</CardTitle>
        <CardDescription>Enter the details of the new artist.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Name is required" })}
              placeholder="Artist's full name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea 
              id="biography" 
              {...register("biography", { required: "Biography is required" })}
              placeholder="Write a brief biography of the artist"
            />
            {errors.biography && <p className="text-sm text-red-500">{errors.biography.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setValue("dateOfBirth", newDate as Date, { shouldValidate: true })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryOfOrigin">Country of Origin</Label>
            <Select onValueChange={(value) => setValue("countryOfOrigin", value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
                <SelectItem value="japan">Japan</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.countryOfOrigin && <p className="text-sm text-red-500">{errors.countryOfOrigin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input 
              id="style" 
              {...register("style", { required: "Style is required" })}
              placeholder="e.g., Impressionism, Cubism, Abstract"
            />
            {errors.style && <p className="text-sm text-red-500">{errors.style.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!isValid} >Add Artist</Button>
        </CardFooter>
      </form>
    </Card>
  )
}