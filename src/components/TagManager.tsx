import React, { useState } from "react";
import type { Tag } from "../types/Todo";
import "./TagManager.css";

interface TagManagerProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag?: (name: string) => void;
}

export function TagManager({
  availableTags,
  selectedTags,
  onTagsChange,
  onCreateTag,
}: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleSubmitNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newTagName.trim();
    if (trimmedName && onCreateTag) {
      onCreateTag(trimmedName);
      setNewTagName("");
      setIsAdding(false);
    }
  };

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, { ...tag }]);
    }
  };

  return (
    <div className="tag-manager">
      <div className="tag-list">
        {availableTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag)}
            className={`tag-button ${
              selectedTags.some((t) => t.id === tag.id) ? "selected" : ""
            }`}
            style={
              {
                "--tag-color": tag.color,
              } as React.CSSProperties
            }
          >
            {tag.name}
          </button>
        ))}
        {onCreateTag && (
          <button
            className="add-tag-button"
            onClick={() => setIsAdding(true)}
            aria-label="Add new tag"
          >
            +
          </button>
        )}
      </div>

      {isAdding && onCreateTag && (
        <form onSubmit={handleSubmitNewTag} className="add-tag-form">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name"
            className="tag-input"
            autoFocus
          />
          <div className="tag-form-buttons">
            <button type="submit" className="tag-submit">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTagName("");
              }}
              className="tag-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
