import { Edit, Trash2, Shield, Users, Lock, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Role } from "./types";

interface RolesListProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onViewRole: (role: Role) => void;
  onSeeUsers: (role: Role) => void;
}

const RolesList = ({ roles, onEditRole, onDeleteRole, onViewRole, onSeeUsers }: RolesListProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Roles List
          <Badge variant="secondary" className="rounded-full">
            {roles.length} roles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="rounded-xl border-border/70">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`rounded-xl p-3 ${role.isSystem ? "bg-purple-100" : "bg-blue-100"
                        }`}
                    >
                      {role.isSystem ? (
                        <Lock className="h-6 w-6 text-purple-600" />
                      ) : (
                        <Key className="h-6 w-6 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {role.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              {role.id}
                            </code>
                            <Badge
                              variant={role.isSystem ? "secondary" : "outline"}
                              className="rounded-full text-xs"
                            >
                              {role.isSystem ? "System Role" : "Custom Role"}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{role.userCount} users</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            Permissions ({role.permissions.length})
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-blue-600 hover:text-blue-700 px-2"
                              onClick={() => onSeeUsers(role)}
                            >
                              See Users
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-primary hover:text-primary/80 px-2"
                              onClick={() => onViewRole(role)}
                            >
                              View Matrix
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.slice(0, 5).map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              {permission.split(".")[1]}
                            </Badge>
                          ))}
                          {role.permissions.length > 5 && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              +{role.permissions.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Created:{" "}
                          {new Date(role.createdAt).toLocaleDateString()}
                        </span>
                        <span>{role.permissions.length} permissions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-lg"
                      onClick={() => onEditRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteRole(role.id)}
                      disabled={role.isSystem}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {roles.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No roles found</p>
              <p className="text-sm text-muted-foreground">
                Create your first custom role to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesList;
