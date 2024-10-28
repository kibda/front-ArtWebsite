'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

import { Card, CardContent,  CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'




type Artist = {
  id: string
  name: string
  biography: string
  dateOfBirth: string
  countryOfOrigin: string
  style: string
}

export default function AllArtists() {

  const [artists, setArtists] = useState<Artist[]>([]) // State to store artists

  // Fetch artists when the component mounts
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/artists/')
      .then(response => setArtists(response.data.artists))
      .catch(error => console.error("Error fetching artists:", error))
  }, [])


  const handleDelete = (id: string) => {
    axios.delete(`http://127.0.0.1:8000/artists/artist/delete/${id}/`)
        .then(response => {
            if (response.data.message === 'Artist deleted successfully!'){
                setArtists(artists.filter(artist => artist.id !== id))
            }
            else {
                console.error("Error deleting artist:", response.data.message)
            }
            
        })
        .catch(error => console.error("Error deleting artist:", error))


  }

 

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      

      {/* Display list of artists */}
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Artist List</CardTitle>
        <CardDescription>View, update, or delete artists from the database.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Country of Origin</TableHead>
              <TableHead>Style</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell className="font-medium">{artist.name}</TableCell>
                <TableCell>{artist.dateOfBirth}</TableCell>
                <TableCell>{artist.countryOfOrigin}</TableCell>
                <TableCell>{artist.style}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="mr-2" >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Artist</DialogTitle>
                        <DialogDescription>Make changes to the artist s information here.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" defaultValue={artist.name} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dob" className="text-right">Date of Birth</Label>
                          <Input id="dob" defaultValue={artist.dateOfBirth} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="country" className="text-right">Country</Label>
                          <Input id="country" defaultValue={artist.countryOfOrigin} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="style" className="text-right">Style</Label>
                          <Input id="style" defaultValue={artist.style} className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" 
                        //onClick={() => handleSaveEdit({ ...artist, name: document.getElementById('name').value, dateOfBirth: document.getElementById('dob').value, countryOfOrigin: document.getElementById('country').value, style: document.getElementById('style').value })}
                            >Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" className="text-red-500" 
                    onClick={() => handleDelete(artist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  )
}
