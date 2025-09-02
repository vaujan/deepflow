export interface Note {
	id: number;
	title: string;
	content: string;
	timestamp: string;
}

export const mockNotes: Note[] = [
	{
		id: 1,
		title: "📝 How to Use Notes Widget",
		content: `<h2>Welcome to the Notes Widget!</h2>
<p>This widget supports <strong>rich text editing</strong> with markdown-like capabilities. Here's how to get started:</p>

<h3>🎯 Basic Usage</h3>
<ul>
<li><strong>Create:</strong> Click the + button to add a new note</li>
<li><strong>Edit:</strong> Click the pencil icon on any note</li>
<li><strong>Delete:</strong> Click the trash icon to remove a note</li>
<li><strong>Save:</strong> Press <kbd>Shift + Enter</kbd> or click Save</li>
<li><strong>Cancel:</strong> Press <kbd>Escape</kbd> to cancel editing</li>
</ul>

<h3>✨ Features</h3>
<p>The editor supports:</p>
<ul>
<li><strong>Bold text</strong> and <em>italic text</em></li>
<li>Headers (H1, H2, H3, etc.)</li>
<li>Bulleted and numbered lists</li>
<li>Code blocks and inline code</li>
<li>Links and more!</li>
</ul>

<p><em>Try editing this note to see the formatting in action!</em></p>`,
		timestamp: "2 hours ago",
	},
	{
		id: 2,
		title: "🎨 Markdown Examples",
		content: `<h1>Markdown Formatting Examples</h1>

<h2>Text Formatting</h2>
<p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.</p>
<p>You can also <s>strikethrough</s> text and create <code>inline code</code>.</p>

<h2>Lists</h2>
<h3>Bulleted List:</h3>
<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item with <strong>bold text</strong></li>
</ul>

<h3>Numbered List:</h3>
<ol>
<li>First step</li>
<li>Second step</li>
<li>Third step with <em>italic text</em></li>
</ol>

<h2>Code Blocks</h2>
<pre><code>function greetUser(name) {
  return \`Hello, \${name}!\`;
}

console.log(greetUser("World"));
</code></pre>

<h2>Links</h2>
<p>You can create <a href="https://example.com">clickable links</a> to external websites.</p>

<h2>Quotes</h2>
<blockquote>
<p>"The best way to learn is by doing."</p>
</blockquote>`,
		timestamp: "1 hour ago",
	},
	{
		id: 3,
		title: "⚡ Keyboard Shortcuts",
		content: `<h2>Keyboard Shortcuts</h2>

<h3>General Shortcuts</h3>
<ul>
<li><kbd>Shift + Enter</kbd> - Save note (when editing)</li>
<li><kbd>Escape</kbd> - Cancel editing or close forms</li>
<li><kbd>Ctrl + B</kbd> - Bold text</li>
<li><kbd>Ctrl + I</kbd> - Italic text</li>
<li><kbd>Ctrl + U</kbd> - Underline text</li>
</ul>

<h3>Text Formatting</h3>
<ul>
<li><kbd>Ctrl + Shift + 1</kbd> - Heading 1</li>
<li><kbd>Ctrl + Shift + 2</kbd> - Heading 2</li>
<li><kbd>Ctrl + Shift + 3</kbd> - Heading 3</li>
<li><kbd>Ctrl + Shift + 8</kbd> - Bullet list</li>
<li><kbd>Ctrl + Shift + 7</kbd> - Numbered list</li>
</ul>

<h3>Pro Tips</h3>
<ul>
<li>💡 <strong>Auto-save:</strong> Notes are automatically saved as you type</li>
<li>💡 <strong>Quick edit:</strong> Click anywhere on a note to start editing</li>
<li>💡 <strong>Rich formatting:</strong> Use the toolbar buttons for easy formatting</li>
<li>💡 <strong>Organize:</strong> Give your notes descriptive titles for easy finding</li>
</ul>`,
		timestamp: "30 minutes ago",
	},
	{
		id: 4,
		title: "📋 Meeting Notes Template",
		content: `<h2>Team Standup - ${new Date().toLocaleDateString()}</h2>

<h3>📅 Date:</h3>
<p>${new Date().toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		})}</h3>

<h3>👥 Attendees:</h3>
<ul>
<li>John Doe</li>
<li>Jane Smith</li>
<li>Mike Johnson</li>
</ul>

<h3>📝 Agenda:</h3>
<ol>
<li>Yesterday's accomplishments</li>
<li>Today's goals</li>
<li>Blockers and challenges</li>
</ol>

<h3>✅ Yesterday's Accomplishments:</h3>
<ul>
<li>Completed user authentication feature</li>
<li>Fixed bug in data validation</li>
<li>Updated documentation</li>
</ul>

<h3>🎯 Today's Goals:</h3>
<ul>
<li>Implement new dashboard design</li>
<li>Review pull requests</li>
<li>Plan next sprint</li>
</ul>

<h3>🚧 Blockers:</h3>
<ul>
<li>Waiting for API response from third-party service</li>
<li>Need clarification on design requirements</li>
</ul>

<h3>📋 Action Items:</h3>
<ul>
<li><strong>John:</strong> Contact API provider about response delays</li>
<li><strong>Jane:</strong> Schedule design review meeting</li>
<li><strong>Mike:</strong> Prepare sprint planning materials</li>
</ul>`,
		timestamp: "15 minutes ago",
	},
	{
		id: 5,
		title: "💡 Ideas & Brainstorming",
		content: `<h2>Project Ideas 💡</h2>

<h3>🚀 New Features to Consider:</h3>
<ul>
<li><strong>Dark Mode Toggle</strong> - User preference for theme switching</li>
<li><strong>Note Categories</strong> - Organize notes with tags or folders</li>
<li><strong>Search Functionality</strong> - Find notes quickly with full-text search</li>
<li><strong>Export Options</strong> - Save notes as PDF, Markdown, or plain text</li>
<li><strong>Collaboration</strong> - Share notes with team members</li>
</ul>

<h3>🎨 UI/UX Improvements:</h3>
<ul>
<li>Add drag-and-drop reordering for notes</li>
<li>Implement note preview on hover</li>
<li>Add keyboard navigation between notes</li>
<li>Create note templates for common use cases</li>
</ul>

<h3>🔧 Technical Considerations:</h3>
<ul>
<li>Performance optimization for large note collections</li>
<li>Offline support with local storage</li>
<li>Sync capabilities across devices</li>
<li>Backup and restore functionality</li>
</ul>

<h3>📊 Priority Matrix:</h3>
<table>
<tr>
<th>Feature</th>
<th>Impact</th>
<th>Effort</th>
<th>Priority</th>
</tr>
<tr>
<td>Dark Mode</td>
<td>High</td>
<td>Low</td>
<td>🔴 High</td>
</tr>
<tr>
<td>Search</td>
<td>High</td>
<td>Medium</td>
<td>🟡 Medium</td>
</tr>
<tr>
<td>Export</td>
<td>Medium</td>
<td>Low</td>
<td>🟡 Medium</td>
</tr>
</table>`,
		timestamp: "5 minutes ago",
	},
	{
		id: 6,
		title: "📚 Learning Resources",
		content: `<h2>Useful Resources 📚</h2>

<h3>📖 Documentation:</h3>
<ul>
<li><a href="https://markdownguide.org/">Markdown Guide</a> - Complete markdown syntax reference</li>
<li><a href="https://www.markdowntutorial.com/">Markdown Tutorial</a> - Interactive learning</li>
<li><a href="https://commonmark.org/">CommonMark</a> - Standardized markdown specification</li>
</ul>

<h3>🛠️ Tools & Extensions:</h3>
<ul>
<li><strong>VS Code:</strong> Markdown All in One extension</li>
<li><strong>Browser:</strong> Markdown Viewer extensions</li>
<li><strong>Online:</strong> <a href="https://dillinger.io/">Dillinger</a> - Online markdown editor</li>
</ul>

<h3>💡 Best Practices:</h3>
<ol>
<li><strong>Use headers</strong> to structure your content</li>
<li><strong>Keep paragraphs short</strong> for better readability</li>
<li><strong>Use lists</strong> for multiple related items</li>
<li><strong>Add emphasis</strong> with bold and italic text</li>
<li><strong>Include code blocks</strong> for technical content</li>
</ol>

<h3>🎯 Quick Reference:</h3>
<pre><code># Header 1
## Header 2
### Header 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link text](https://example.com)
\`inline code\`

\`\`\`javascript
// Code block
function example() {
  return "Hello World";
}
\`\`\`</code></pre>`,
		timestamp: "Just now",
	},
];
