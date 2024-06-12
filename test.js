/*
const fontOpenRegex =
    /\\${font={                                 // Matches the literal "${font={"
    (?=                                        // Start of positive lookahead assertion
        (?:.*?\\bbold=(?<bold>true|false)\b)?   // Checks if "bold=true" or "bold=false" exists
    )                                          // End of lookahead assertion for "bold"
    (?=                                        // Start of positive lookahead assertion
        (?:.*?\bsize=(?<size>[\w%]+)\b)?       // Checks if "size=something" exists
    )                                          // End of lookahead assertion for "size"
    (?=                                        // Start of positive lookahead assertion
        (?:.*?\bcolor=(?<color>[\w#]+)\b)?     // Checks if "color=something" exists
    )                                          // End of lookahead assertion for "color"
    .*?                                        // Matches any characters non-greedily
}}/g;                                          // Matches the closing brace of the font placeholder and flags for global search
*/
// const fontOpenRegex = /\${font={(?=(?:.*?\bbold=(?<bold>true|false)\b)?)(?=(?:.*?\bsize=(?<size>[\w%]+)\b)?)(?=(?:.*?\bcolor=(?<color>[\w#]+)\b)?).*?}}/g;
let yourString = "This is a question message with an image ${image={src='https://bellard.org/bpg/2.png' radius= 20px size=[100px,100px] }}." +
    "And this text is ${font={bold=true size=2rem color=red}}bold and red${/font}. Here is a link.";;

const fontOpenRegex = new RegExp(
    '\\${font={'
    + '(?=(?:.*?\\bbold=(?<bold>true|false)\\b)?)'
    + '(?=(?:.*?\\bsize=(?<size>[\\w%]+)\\b)?)'
    + '(?=(?:.*?\\bcolor=(?<color>[\\w#]+)\\b)?)'
    + '.*?}}',
    'g'
);
const imageRegex = new RegExp(
    '\\${image={'
    + '(?=(?:.*?\\bsrc\\s*=\\s*\'(?<src>.*?)\'))'
    + '(?=(?:.*?\\bradius\\s*=\\s*(?<radius>[\\w]+)\\b)?)'
    + '(?=(?:.*?\\bsize\\s*=\\s*\\[\\s*(?<width>.*?)\\s*,\\s*(?<height>.*?)\\s*\\]))'
    + '.*?}}',
    'g'
  );

    // + '(?=(?:.*?\\bsize=\\[(?<width>.*?),(?<height>.*?)\\]\\s*))'
/*
This is a question message with an image <img src=https://bellard.org/bpg/2.png'
radius=20px size=[100px,100px] }}.And this text is
<span style="font-weight: bold; font-size: 2rem; color: red; "></span>bold and red${/font}.
Here is a link ${link=  style="" />" />" />" />.And this text is
<span style="font-weight: bold; font-size: 2rem; color: red; "></span>bold and red${/font}.
Here is a link ${link='https://www.example.com'}.

This is a question message with an image <img  style="" />.
And this text is <span style="font-weight: bold; font-size: 2rem; color: red; "></span>bold and red${/font}.
Here is a link.
*/



let match;

while ((match = imageRegex.exec(yourString)) !== null) {
  console.log(match);
    const src    = match.groups.src || '';
    const radius = match.groups.radius;
    const width  = match.groups.width;
    const height = match.groups.height;

    let replacement = '<img ';
    if (src  ) replacement += `src=${src} `;

    replacement += ' style="';
    if (radius) replacement += `border-radius: ${radius}; `;
    if (width ) replacement += `width: ${width}; `;
    if (height) replacement += `height: ${height}; `;
    replacement += '" />';

    yourString = yourString.replace(match[0], replacement);
  }

while ((match = fontOpenRegex.exec(yourString)) !== null) {

  const bold = match.groups.bold === "true";
  const size = match.groups.size;
  const color = match.groups.color;

  let replacement = '<span style="';
  if (bold) replacement += 'font-weight: bold; ';
  if (size) replacement += `font-size: ${size}; `;
  if (color) replacement += `color: ${color}; `;
  replacement += '"></span>';

  yourString = yourString.replace(match[0], replacement);
}

console.log(yourString);
