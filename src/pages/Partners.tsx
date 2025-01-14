import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  components: string[];
  tags: string[];
}

const projectComponents = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Project Management",
  "Quality Assurance",
];

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const handleSavePartner = (data: Omit<Partner, "id">) => {
    if (editingPartner) {
      setPartners(
        partners.map((partner) =>
          partner.id === editingPartner.id
            ? { ...partner, ...data }
            : partner
        )
      );
      setEditingPartner(null);
    } else {
      const newPartner: Partner = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      setPartners([...partners, newPartner]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Partners</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Edit Partner" : "Add New Partner"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const components = projectComponents.filter(
                  (component) => formData.get(component) === "on"
                );
                const tags = formData
                  .get("tags")
                  ?.toString()
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean) || [];
                handleSavePartner({
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  components,
                  tags,
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPartner?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingPartner?.email}
                  required
                />
              </div>
              <div>
                <Label>Project Components</Label>
                <div className="space-y-2">
                  {projectComponents.map((component) => (
                    <div key={component} className="flex items-center space-x-2">
                      <Checkbox
                        id={component}
                        name={component}
                        defaultChecked={editingPartner?.components.includes(
                          component
                        )}
                      />
                      <Label htmlFor={component}>{component}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={editingPartner?.tags.join(", ")}
                />
              </div>
              <Button type="submit">
                {editingPartner ? "Save Changes" : "Add Partner"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="font-semibold">{partner.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {partner.email}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.components.map((component) => (
                      <Badge key={component} variant="secondary">
                        {component}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingPartner(partner)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Partners;