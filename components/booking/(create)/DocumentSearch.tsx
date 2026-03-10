// @/components/booking/create/DocumentSearch.tsx
import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "./types";

interface DocumentSearchProps {
  onDocumentSelect: (customer: Customer) => void;
  customers: Customer[];
}

const DocumentSearch = ({
  onDocumentSelect,
  customers,
}: DocumentSearchProps) => {
  const [documentNo, setDocumentNo] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (documentNo.trim().length > 0) {
      const results = customers.filter(
        (customer) =>
          customer.documentNo.includes(documentNo.trim()) ||
          customer.name.toLowerCase().includes(documentNo.toLowerCase()) ||
          customer.code.toLowerCase().includes(documentNo.toLowerCase())
      );
      setSearchResults(results);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [documentNo, customers]);

  const handleSearch = () => {
    if (!documentNo.trim()) {
      setSearchResults(customers);
      setShowSuggestions(true);
      return;
    }

    const results = customers.filter(
      (customer) =>
        customer.documentNo.includes(documentNo.trim()) ||
        customer.name.toLowerCase().includes(documentNo.toLowerCase()) ||
        customer.code.toLowerCase().includes(documentNo.toLowerCase())
    );

    setSearchResults(results);
    setShowSuggestions(true);
  };

  const handleDocumentSelect = (customer: Customer) => {
    onDocumentSelect(customer);
    setDocumentNo(customer.documentNo);
    setShowSuggestions(false);
    setSearchResults([]);
  };

  const handleAddNew = () => {
    setDocumentNo("");
    setSearchResults(customers);
    setShowSuggestions(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="documentNo" className="text-sm font-medium">
            Document No
          </Label>
          <div className="relative">
            <Input
              id="documentNo"
              placeholder="Type document number or customer name..."
              value={documentNo}
              onChange={(e) => setDocumentNo(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              className="pr-24 rounded-lg"
            />
            <Button
              type="button"
              onClick={handleSearch}
              size="sm"
              className="absolute right-1 top-1 h-8 px-3 rounded-lg"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Start typing to see suggestions. Try: 123, 451, 136, yellow, blue,
            etc.
          </p>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddNew}
            className="gap-2 rounded-lg bg-green-600 hover:bg-green-700 h-10"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {showSuggestions && searchResults.length > 0 && (
        <div className="border rounded-lg p-3 bg-white shadow-lg max-h-60 overflow-y-auto">
          <Label className="text-sm font-medium mb-2 block">
            Select Customer
          </Label>
          <div className="space-y-2">
            {searchResults.map((customer) => (
              <div
                key={customer.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleDocumentSelect(customer)}
              >
                <div className="font-medium text-sm flex justify-between">
                  <span>{customer.name}</span>
                  <span className="text-primary font-mono">
                    {customer.documentNo}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Code: {customer.code} | {customer.address1}, {customer.city}
                </div>
                <div className="text-xs text-muted-foreground">
                  Contact: {customer.contactPerson} | {customer.mobileNo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && searchResults.length === 0 && documentNo.trim() && (
        <div className="border rounded-lg p-3 bg-yellow-50/50">
          <p className="text-sm text-yellow-800">
            No customer found matching: <strong>"{documentNo}"</strong>
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Available customers: 123456, 451220, 136909, 789012, 345678
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentSearch;
