import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const CowProfile = () => {  
    const router = useRouter();
    const { id } = router.query;
    const [cow, setCow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (id) {
            fetch(`/api/cows/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setCow(data);
                setLoading(false);
            });
    }