"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useUser } from "@clerk/nextjs";
import { Mail, Search, UserIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";
import { cn } from "@/lib/utils";

function UserSearch({
  onSelectUser,
  placeholder = "Search users...",
  className,
}: {
  onSelectUser: (user: Doc<"users">) => void;
  placeholder?: string;
  className?: string;
}) {
  const { searchTerm, setSearchTerm, searchResults, isLoading } =
    useUserSearch();
  const { user } = useUser();

  const filteredResults = searchResults.filter(
    (searchUser) => searchUser.userId !== user?.id
  );

  const handleSelectUser = (user: (typeof searchResults)[0]) => {
    onSelectUser?.(user);
    setSearchTerm("");
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn("pl-12 pr-12 h-12 text-base", className)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {searchTerm.trim() && (
        <div className="mt-2 bg-card border rounded-lg">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner />
                <span>Searching...</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <UserIcon className="mx-auto mb-1" />
              <p>No user{searchTerm}</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "w-full px-4 py-2 hover:bg-accent transition-colors"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full ring-2 ring-border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-1" />
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserSearch;
