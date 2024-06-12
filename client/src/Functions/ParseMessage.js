
export default function parseMessage(message)
{
	const imageRegex = new RegExp(
		'\\${image={'
		+ '(?=(?:.*?\\bsrc\\s*=\\s*\'(?<src>.*?)\'))'
		+ '(?=(?:.*?\\bautodown\\s*=\\s*(?<autodown>true|false)\\b)?)'
		+ '(?=(?:.*?\\bradius\\s*=\\s*(?<radius>[\\w]+)\\b)?)'
		+ '(?=(?:.*?\\bbordersize\\s*=\\s*(?<bordersize>[\\w]+)\\b)?)'
		+ '(?=(?:.*?\\bbordercolor\\s*=\\s*(?<bordercolor>[\\w#]+)\\b)?)'
		+ '(?=(?:.*?\\bbordertype\\s*=\\s*(?<bordertype>[\\w]+)\\b)?)'
		+ '(?=(?:.*?\\bsize\\s*=\\s*\\[\\s*(?<width>.*?)\\s*,\\s*(?<height>.*?)\\s*\\]))'
		+ '.*?}}',
		'g'
	);
	const fontOpenRegex = new RegExp(
		'\\${font={'
		+ '(?=(?:.*?\\bbold\\s*=\\s*(?<bold>true|false)\\b)?)'
		+ '(?=(?:.*?\\bsize\\s*=\\s*(?<size>[\\w%]+)\\b)?)'
		+ '(?=(?:.*?\\bcolor\\s*=\\s*(?<color>[\\w#]+)\\b)?)'
		+ '.*?}}',
		'g'
	);
	const fontCloseRegex = /\${\/font}/g;
	const linkRegex = /\${\s*link\s*=\s*'(.*?)'\s*}/g;

	let match;
	while ((match = imageRegex.exec(message)) !== null) {
		const src         = match.groups.src || '';
		const auto        = match.groups.autodown === 'true';
		const radius      = match.groups.radius;
		const width       = match.groups.width;
		const height      = match.groups.height;
		const bordersize  = match.groups.bordersize;
		const bordercolor = match.groups.bordercolor || '#E4E7ED';
		const bordertype  = match.groups.bordertype || 'solid';

		let replacement = '<img ';
		if (src  ) replacement += `src=${src} `;

		replacement += ' style="';
		if (auto      ) replacement += `display: block; margin: 1em auto;`;
		if (radius    ) replacement += `border-radius: ${radius}; `;
		if (width     ) replacement += `width: ${width}; `;
		if (height    ) replacement += `height: ${height}; `;
		if (bordersize) replacement += `border: ${bordersize} ${bordertype} ${bordercolor}; `;
		replacement += '">';

		message = message.replace(match[0], replacement);
	}

	while ((match   = fontOpenRegex.exec(message)) !== null) {
		const bold  = match.groups.bold === "true";
		const size  = match.groups.size;
		const color = match.groups.color;

		let replacement = '<span style="';
		if (bold ) replacement += 'font-weight: bold; ';
		if (size ) replacement += `font-size: ${size}; `;
		if (color) replacement += `color: ${color}; `;
		replacement += '">';

		message = message.replace(match[0], replacement);
	}
	message = message.replace(fontCloseRegex, `</span>`);
	message = message.replace(linkRegex, (match, link) => { return `<a href="${link}" target="_blank">${link}</a>` } );

	return message;
}