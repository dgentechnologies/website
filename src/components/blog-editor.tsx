'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Eye,
  Save,
  Loader2,
  Calendar,
  UserCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

// Shared author list - can be imported by other components
export const BLOG_AUTHORS = [
  'Tirthankar Dasgupta',
  'Sukomal Debnath',
  'Sagnik Mandal',
  'Arpan Bairagi',
] as const;

export type BlogAuthor = (typeof BLOG_AUTHORS)[number];

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialDescription?: string;
  initialImage?: string;
  initialImageHint?: string;
  initialAuthor?: string;
  initialTags?: string[];
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  isSaving?: boolean;
  onGenerateWithAI?: (title: string, author: string) => void;
  isGenerating?: boolean;
  mode?: 'create' | 'edit';
}

export function BlogEditor({
  initialTitle = '',
  initialContent = '',
  initialDescription = '',
  initialImage = '',
  initialImageHint = '',
  initialAuthor = '',
  initialTags = [],
  onSave,
  isSaving = false,
  onGenerateWithAI,
  isGenerating = false,
  mode = 'create',
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [description, setDescription] = useState(initialDescription);
  const [image, setImage] = useState(initialImage);
  const [imageHint, setImageHint] = useState(initialImageHint);
  const [author, setAuthor] = useState(initialAuthor);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [imageError, setImageError] = useState(false);
  
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Update state when initial values change (e.g., after AI generation)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setDescription(initialDescription);
    setImage(initialImage);
    setImageHint(initialImageHint);
    setAuthor(initialAuthor);
    setTags(initialTags);
    setImageError(false); // Reset image error when image URL changes
  }, [initialTitle, initialContent, initialDescription, initialImage, initialImageHint, initialAuthor, initialTags]);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const insertFormatting = useCallback(
    (before: string, after: string = '') => {
      const textarea = contentTextareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent =
        content.substring(0, start) +
        before +
        selectedText +
        after +
        content.substring(end);
      setContent(newContent);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
      }, 0);
    },
    [content]
  );

  const handleBold = () => insertFormatting('<strong>', '</strong>');
  const handleItalic = () => insertFormatting('<em>', '</em>');
  const handleUnderline = () => insertFormatting('<u>', '</u>');
  const handleH1 = () => insertFormatting('<h1>', '</h1>');
  const handleH2 = () => insertFormatting('<h2>', '</h2>');
  const handleH3 = () => insertFormatting('<h3>', '</h3>');
  const handleQuote = () => insertFormatting('<blockquote>', '</blockquote>');
  const handleUnorderedList = () => insertFormatting('<ul>\n  <li>', '</li>\n</ul>');
  const handleOrderedList = () => insertFormatting('<ol>\n  <li>', '</li>\n</ol>');
  const handleLink = () => insertFormatting('<a href="URL">', '</a>');
  const handleImage = () => insertFormatting('<img src="', '" alt="Description" />');
  const handleParagraph = () => insertFormatting('<p>', '</p>');
  const handleAlignLeft = () => insertFormatting('<div style="text-align: left;">', '</div>');
  const handleAlignCenter = () => insertFormatting('<div style="text-align: center;">', '</div>');
  const handleAlignRight = () => insertFormatting('<div style="text-align: right;">', '</div>');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    await onSave({
      title,
      content,
      description,
      image,
      imageHint,
      author,
      tags,
      date: currentDate,
    });
  };

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    tooltip,
    disabled = false,
  }: {
    icon: React.ElementType;
    onClick: () => void;
    tooltip: string;
    disabled?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex h-full gap-6">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="bg-card border rounded-t-lg p-2">
            <div className="flex flex-wrap items-center gap-1">
              {/* Text Formatting */}
              <ToolbarButton icon={Bold} onClick={handleBold} tooltip="Bold (Ctrl+B)" />
              <ToolbarButton icon={Italic} onClick={handleItalic} tooltip="Italic (Ctrl+I)" />
              <ToolbarButton icon={Underline} onClick={handleUnderline} tooltip="Underline (Ctrl+U)" />
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Headings */}
              <ToolbarButton icon={Heading1} onClick={handleH1} tooltip="Heading 1" />
              <ToolbarButton icon={Heading2} onClick={handleH2} tooltip="Heading 2" />
              <ToolbarButton icon={Heading3} onClick={handleH3} tooltip="Heading 3" />
              <ToolbarButton icon={FileText} onClick={handleParagraph} tooltip="Paragraph" />
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Alignment */}
              <ToolbarButton icon={AlignLeft} onClick={handleAlignLeft} tooltip="Align Left" />
              <ToolbarButton icon={AlignCenter} onClick={handleAlignCenter} tooltip="Align Center" />
              <ToolbarButton icon={AlignRight} onClick={handleAlignRight} tooltip="Align Right" />
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Lists & Quote */}
              <ToolbarButton icon={List} onClick={handleUnorderedList} tooltip="Bullet List" />
              <ToolbarButton icon={ListOrdered} onClick={handleOrderedList} tooltip="Numbered List" />
              <ToolbarButton icon={Quote} onClick={handleQuote} tooltip="Quote" />
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Media */}
              <ToolbarButton icon={LinkIcon} onClick={handleLink} tooltip="Insert Link" />
              <ToolbarButton icon={ImageIcon} onClick={handleImage} tooltip="Insert Image" />

              {/* AI Generate Button */}
              {mode === 'create' && onGenerateWithAI && (
                <>
                  <Separator orientation="vertical" className="mx-1 h-6" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={() => onGenerateWithAI(title, author)}
                        disabled={isGenerating || !author || !title}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate with AI
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {!author ? 'Select an author first' : !title ? 'Enter a title/topic first' : 'Generate content using AI'}
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* Save Button */}
              <div className="flex-1" />
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !title || !author}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {mode === 'create' ? 'Publish' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Document Area */}
          <div className="flex-1 bg-card border border-t-0 rounded-b-lg overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 md:p-8 space-y-6">
                {/* Meta Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Author</label>
                    <Select value={author} onValueChange={setAuthor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_AUTHORS.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Date</label>
                    <Input value={currentDate} disabled className="bg-muted" />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Featured Image URL</label>
                    <Input
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImageError(false); // Reset error when URL changes
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Image Hint</label>
                    <Input
                      value={imageHint}
                      onChange={(e) => setImageHint(e.target.value)}
                      placeholder="e.g., 'technology abstract'"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a tag and press Enter"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Title */}
                <div className="space-y-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog post title..."
                    className="text-2xl md:text-3xl font-bold font-headline border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-foreground/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Meta Description (SEO)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a brief description for search engines..."
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <Separator />

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Content (HTML)</label>
                  <Textarea
                    ref={contentTextareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your blog post content here... Use the toolbar above to format your text with HTML tags."
                    className="min-h-[400px] font-mono text-sm resize-y"
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:flex flex-col w-[500px] min-w-[400px]">
          <div className="bg-card border rounded-t-lg p-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-foreground/70" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>
          <div className="flex-1 bg-card border border-t-0 rounded-b-lg overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {/* Preview Header */}
                {image && !imageError && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={title || 'Featured image'}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-headline font-bold mb-4">
                  {title || 'Your Title Here'}
                </h1>

                {/* Meta */}
                <div className="flex items-center text-sm text-foreground/70 gap-4 mb-6">
                  {author && (
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <span>{author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentDate}</span>
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <p className="text-foreground/70 italic mb-6 pb-4 border-b">
                    {description}
                  </p>
                )}

                {/* Content */}
                <div
                  className="prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: content || '<p class="text-foreground/50">Your content will appear here...</p>',
                  }}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
