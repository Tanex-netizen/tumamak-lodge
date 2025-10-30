import { useEffect, useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Plus, Edit, Trash2, Upload, X, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function RoomsManagement() {
  const { rooms, isLoading, error, fetchRooms, createRoom, updateRoom, deleteRoom, uploadRoomImages, deleteRoomImage, clearError } = useRoomStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    description: '',
    price: '',
    capacityAdults: '2',
    capacityChildren: '1',
    size: '',
    bedType: 'Queen',
    amenities: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Standard',
      description: '',
      price: '',
      capacityAdults: '2',
      capacityChildren: '1',
      size: '',
      bedType: 'Queen',
      amenities: '',
      isAvailable: true,
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: {
          adults: parseInt(formData.capacityAdults) || 2,
          children: parseInt(formData.capacityChildren) || 1,
        },
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      };
      delete roomData.capacityAdults;
      delete roomData.capacityChildren;
      await createRoom(roomData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: {
          adults: parseInt(formData.capacityAdults) || 2,
          children: parseInt(formData.capacityChildren) || 1,
        },
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      };
      delete roomData.capacityAdults;
      delete roomData.capacityChildren;
      await updateRoom(selectedRoom._id, roomData);
      setIsEditDialogOpen(false);
      setSelectedRoom(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update room:', err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await deleteRoom(roomId);
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    }
  };

  const openEditDialog = (room) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      description: room.description,
      price: room.price.toString(),
      capacityAdults: typeof room.capacity === 'object' ? room.capacity.adults.toString() : '2',
      capacityChildren: typeof room.capacity === 'object' ? room.capacity.children.toString() : '1',
      size: room.size || '',
      bedType: room.bedType || 'Queen',
      amenities: room.amenities.join(', '),
      isAvailable: room.isAvailable,
    });
    setIsEditDialogOpen(true);
  };

  const openImageDialog = (room) => {
    setSelectedRoom(room);
    setSelectedFiles([]);
    setIsImageDialogOpen(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await uploadRoomImages(selectedRoom._id, selectedFiles);
      setIsImageDialogOpen(false);
      setSelectedRoom(null);
      setSelectedFiles([]);
    } catch (err) {
      console.error('Failed to upload images:', err);
    }
  };

  const handleDeleteImage = async (roomId, publicId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteRoomImage(roomId, publicId);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
  };

  const RoomForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Room Type *</Label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Family">Family</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price per Night (₱) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacityAdults">Max Adults *</Label>
            <Input
              id="capacityAdults"
              type="number"
              min="1"
              value={formData.capacityAdults}
              onChange={(e) => setFormData({ ...formData, capacityAdults: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacityChildren">Max Children *</Label>
            <Input
              id="capacityChildren"
              type="number"
              min="0"
              value={formData.capacityChildren}
              onChange={(e) => setFormData({ ...formData, capacityChildren: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="size">Size (e.g., 25 sqm)</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedType">Bed Type</Label>
          <Select
            id="bedType"
            value={formData.bedType}
            onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Queen">Queen</option>
            <option value="King">King</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input
          id="amenities"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          placeholder="WiFi, Air Conditioning, Mini Fridge"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAvailable"
          checked={formData.isAvailable}
          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-brown-300 text-brown-700 focus:ring-brown-500"
        />
        <Label htmlFor="isAvailable" className="cursor-pointer">
          Room is available for booking
        </Label>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (isEdit ? 'Update Room' : 'Create Room')}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Rooms Management</h1>
          <p className="text-brown-600 mt-1">
            Manage your lodge rooms, pricing, and availability
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && rooms.length === 0 ? (
            <div className="text-center py-12 text-brown-600">Loading rooms...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-brown-600 py-8">
                      No rooms yet. Add your first room to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell>
                        {room.images?.[0] ? (
                          <img
                            src={room.images[0].url}
                            alt={room.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-brown-100 rounded flex items-center justify-center text-brown-400 text-xs">
                            No image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{formatCurrency(room.price)}</TableCell>
                      <TableCell>
                        {typeof room.capacity === 'object' 
                          ? `${room.capacity.adults || 0}A, ${room.capacity.children || 0}C`
                          : `${room.capacity || 0} guests`}
                      </TableCell>
                      <TableCell>
                        {room.isAvailable ? (
                          <Badge variant="success">
                            <Check className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="h-3 w-3 mr-1" />
                            Unavailable
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openImageDialog(room)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          {room.images?.length || 0}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRoom(room._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <RoomForm onSubmit={handleAddRoom} />
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <RoomForm onSubmit={handleEditRoom} isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent onClose={() => setIsImageDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Manage Room Images</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Images */}
            {selectedRoom?.images && selectedRoom.images.length > 0 && (
              <div>
                <Label className="mb-2 block">Current Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedRoom.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Room ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(selectedRoom._id, image.public_id)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <Label htmlFor="images" className="mb-2 block">
                Upload New Images
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              {selectedFiles.length > 0 && (
                <p className="text-sm text-brown-600 mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImageDialogOpen(false);
                setSelectedFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadImages}
              disabled={selectedFiles.length === 0 || isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Images'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
