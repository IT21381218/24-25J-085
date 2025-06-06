import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

const CowProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCowData = () => {
      if (id) {
        fetch(`/api/cows/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setCow(data);
            setFormData(data);
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
          })
          .catch((err) => console.error("Error fetching cow data:", err));
      }
    };

    fetchCowData();
    const interval = setInterval(fetchCowData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const response = await fetch(`/api/cows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast({ title: "Cow details updated successfully!" });
      setCow(formData);
      setEditMode(false);
      setLastUpdated(new Date().toLocaleTimeString());
    } else {
      toast({ title: "Failed to update cow details", variant: "destructive" });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cow Profile - ID {cow?.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="text-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Cow Profile"
                  width={120}
                  height={120}
                  className="mx-auto rounded-full"
                />
              ) : (
                <p className="text-gray-500">No Image Uploaded</p>
              )}
              {editMode && <input type="file" accept="image/*" onChange={handleImageUpload} />}
            </div>

            <div>
              <Label>Cow ID</Label>
              <Input value={cow?.id || ""} disabled />
            </div>
            <div>
              <Label>Breed</Label>
              {editMode ? (
                <Input name="breed" value={formData.breed || ""} onChange={handleChange} />
              ) : (
                <p className="text-gray-700">{cow?.breed}</p>
              )}
            </div>
            <div>
              <Label>Age</Label>
              {editMode ? (
                <Input name="age" value={formData.age || ""} onChange={handleChange} />
              ) : (
                <p className="text-gray-700">{cow?.age} years</p>
              )}
            </div>

            <div>
              <Label>Health Status</Label>
              <p
                className={`font-semibold px-3 py-1 rounded-lg ${
                  cow?.health_status === "Healthy"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {cow?.health_status}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Temperature</Label>
                <p className="text-blue-600">{cow?.temperature} °C</p>
              </div>
              <div>
                <Label>Heart Rate</Label>
                <p className="text-blue-600">{cow?.heart_rate} BPM</p>
              </div>
              <div>
                <Label>SpO2</Label>
                <p className="text-blue-600">{cow?.spo2} %</p>
              </div>
            </div>

            <p className="text-xs text-gray-500">Last updated: {lastUpdated}</p>

            {editMode && (
              <Button className="w-full mt-4" onClick={handleSave}>
                Save Changes
              </Button>
            )}
            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CowProfile;
