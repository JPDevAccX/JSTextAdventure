Project brief: "Create a JavaScript browser-based text adventure game using OOP principles"

Project scope:
Single HTML page with external CSS stylesheet, and use of JavaScript for dynamic content
Implementation of basic adventure game / interactive-fiction functionality including win / lose conditions

Content and functionality: I chose to re-use some work from the JavaScript Quiz project (basic HTML outline, some of the CSS, and the general JavaScript framework including the multi-game selection system). The adventure game system itself supports interlinked rooms (derived from a map format rather than being explicitly linked), NPCs, items (including consumables), and container-items (containers which are themselves items and can be nested). There is also a rudimentary battle system.

Issues and potential future improvements:
The organisation of objects is probably not optimal. It could be beneficial to generalise room / inventory contents so that various object types can be contained within, rather than just Item objects. There is also the potential for improvement in the parser, which cannot currently handle multi-word tokens or "do this then that" structured commands. There is also currently some inconsistency in how different commands function (e.g. 'unlock' automatically selects the relevant item from inventory but other commands require an explicit item to be specified).