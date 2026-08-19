/* ================= 静态数据：内容库 v2 ================= */
const APP_VERSION = "2.0.0";

const EXERCISE_SUGGESTIONS = [
  "快走 30 分钟（约 120 千卡）",
  "HIIT 燃脂 20 分钟（约 180 千卡）",
  "慢跑 3 公里（约 210 千卡）",
  "游泳 40 分钟（约 280 千卡）",
  "瑜伽拉伸 30 分钟（约 90 千卡）",
  "骑行 45 分钟（约 240 千卡）",
  "帕梅拉全身燃脂 20 分钟（约 160 千卡）",
  "爬楼梯 20 分钟（约 200 千卡）",
  "跳绳 1000 个（约 150 千卡）",
  "羽毛球 1 小时（约 300 千卡）"
];

/* ---------- CET-6 趣味英语每日包（12 篇轮换） ----------
 * 参考“每日英语听力”的视频学习方式：
 * 视频播放 → 逐句听力 → 填空游戏 → 口语跟读
 * 填空句为改编自演讲的练习句，非逐字原稿。
 */
const ENGLISH_PACKS = [
  {
    day: 1, slug: "matt_cutts_try_something_new_for_30_days",
    title: "30 天挑战：新习惯其实不难", speaker: "Matt Cutts", dur: "03:27", level: "四级~六级",
    fun: "轻松幽默 · 习惯养成",
    words: [
      { en: "habit", ph: "/ˈhæbɪt/", cn: "习惯", ex: "30 days is enough to add a new habit." },
      { en: "challenge", ph: "/ˈtʃælɪndʒ/", cn: "挑战", ex: "I set myself a 30-day challenge." },
      { en: "give up", ph: "/ɡɪv ʌp/", cn: "放弃；戒掉", ex: "I decided to give up sugar." },
      { en: "embarrassed", ph: "/ɪmˈbærəst/", cn: "尴尬的", ex: "I was embarrassed at the end of the month." },
      { en: "grateful", ph: "/ˈɡreɪtfl/", cn: "感激的", ex: "I felt grateful for what I had." },
      { en: "fitter", ph: "/ˈfɪtər/", cn: "更健康的", ex: "I noticed I was physically fitter." }
    ],
    cloze: [
      { s: "I decided to {give} up sugar, no TV, and no Twitter for 30 days.", cn: "我决定 30 天不吃糖、不看电视、不上推特。" },
      { s: "Here's what I learned: I was much more {grateful} for what I had.", cn: "我学到：我对自己拥有的更加感激。" },
      { s: "I was so {embarrassed} at the end of the month.", cn: "月底的时候我非常尴尬。" },
      { s: "I noticed that I was physically {fitter}.", cn: "我注意到自己身体更健康了。" },
      { s: "It turns out 30 days is just about the right amount of time to {add} a new habit.", cn: "事实证明 30 天刚好是养成一个新习惯的时间。" },
      { s: "If you really want something, you can {make} time for it.", cn: "如果你真的想要某样东西，你就能为它挤出时间。" }
    ],
    quiz: [
      { q: "What did Matt Cutts give up during his 30-day challenge?", opts: ["Sugar", "No TV", "Twitter", "All of the above"], ans: 3, cn: "他同时戒了糖、电视和推特。" },
      { q: "What did he notice about himself at the end of the month?", opts: ["He felt bored", "He was physically fitter", "He gave up", "He got richer"], ans: 1, cn: "他注意到自己身体状态变好了。" },
      { q: "What is the main idea of this talk?", opts: ["30 days is enough to build a new habit", "Sugar is bad for you", "TV is a waste of time", "Twitter is addictive"], ans: 0, cn: "核心观点：30 天足以养成一个新习惯。" }
    ],
    speaking: {
      lines: [
        { en: "I decided to give up sugar for 30 days.", cn: "我决定 30 天不吃糖。" },
        { en: "If you really want something, you can make time for it.", cn: "如果你真的想要，你就能为它挤出时间。" }
      ],
      prompt: "用 3 句话介绍一件你想坚持 30 天的小事。"
    }
  },
  {
    day: 2, slug: "lydia_machova_the_secrets_of_learning_a_new_language",
    title: "会 9 门语言的人怎么学外语", speaker: "Lýdia Machová", dur: "10:49", level: "四级~六级",
    fun: "语言学习 · 方法揭秘",
    words: [
      { en: "polyglot", ph: "/ˈpɑːliɡlɑːt/", cn: "多语者", ex: "She is a polyglot who speaks nine languages." },
      { en: "genius", ph: "/ˈdʒiːniəs/", cn: "天才", ex: "Polyglots are not geniuses." },
      { en: "enjoyment", ph: "/ɪnˈdʒɔɪmənt/", cn: "享受", ex: "Find enjoyment in learning." },
      { en: "communicate", ph: "/kəˈmjuːnɪkeɪt/", cn: "交流", ex: "We learn languages to communicate." },
      { en: "fluent", ph: "/ˈfluːənt/", cn: "流利的", ex: "She became fluent in three years." },
      { en: "routine", ph: "/ruːˈtiːn/", cn: "日常惯例", ex: "Make learning part of your daily routine." }
    ],
    cloze: [
      { s: "I love learning {foreign} languages. I can speak nine languages.", cn: "我热爱学外语，我会说九门语言。" },
      { s: "Polyglots are not {geniuses}; they simply found ways to enjoy the language.", cn: "多语者不是天才，他们只是找到了享受语言的方法。" },
      { s: "Instead of memorizing words, find ways to {enjoy} the language.", cn: "与其死记单词，不如找到享受这门语言的方式。" },
      { s: "Make the language a part of your {life}.", cn: "让语言成为你生活的一部分。" },
      { s: "You don't need talent; you need to {practice} a little every day.", cn: "你不需要天赋，你需要每天练一点点。" },
      { s: "Learning a language is like {exercise}: a little every day works best.", cn: "学语言就像锻炼：每天一点效果最好。" }
    ],
    quiz: [
      { q: "How many languages does Lýdia Machová speak?", opts: ["Five", "Seven", "Nine", "Twelve"], ans: 2, cn: "她会说 9 门语言。" },
      { q: "What do polyglots have in common?", opts: ["They are geniuses", "They enjoy learning", "They have language genes", "They study 10 hours a day"], ans: 1, cn: "共同点是找到了学习乐趣。" },
      { q: "What is her key advice?", opts: ["Buy expensive courses", "Find ways to enjoy the language", "Only study grammar", "Move abroad first"], ans: 1, cn: "关键建议：找到享受语言的方式。" }
    ],
    speaking: {
      lines: [
        { en: "I love learning foreign languages.", cn: "我热爱学习外语。" },
        { en: "Find a way to enjoy the language every day.", cn: "每天找到一种享受这门语言的方式。" }
      ],
      prompt: "用英语回答：你最喜欢用哪种方式学英语？为什么？"
    }
  },
  {
    day: 3, slug: "julian_treasure_5_ways_to_listen_better",
    title: "5 个方法把听力练好", speaker: "Julian Treasure", dur: "07:41", level: "四级~六级",
    fun: "听力弱必看 · 方法实操",
    words: [
      { en: "listen", ph: "/ˈlɪsn/", cn: "倾听", ex: "We spend a lot of time listening." },
      { en: "silence", ph: "/ˈsaɪləns/", cn: "安静", ex: "Silence is a great listening aid." },
      { en: "conscious", ph: "/ˈkɑːnʃəs/", cn: "有意识的", ex: "Practice conscious listening." },
      { en: "attention", ph: "/əˈtenʃn/", cn: "注意力", ex: "Give the speaker your full attention." },
      { en: "summarize", ph: "/ˈsʌməraɪz/", cn: "总结", ex: "Summarize what you heard." },
      { en: "understand", ph: "/ˌʌndərˈstænd/", cn: "理解", ex: "Listening creates understanding." }
    ],
    cloze: [
      { s: "We spend about 60 percent of our communication time {listening}, but we're not very good at it.", cn: "我们把约 60% 的沟通时间花在听上，但我们并不擅长。" },
      { s: "Silence is the best listening {aid}.", cn: "安静是最好的倾听辅助。" },
      { s: "We need conscious listening to create {understanding}.", cn: "我们需要有意识的倾听来创造理解。" },
      { s: "RASA stands for Receive, Appreciate, {Summarize} and Ask.", cn: "RASA 代表接收、欣赏、总结和提问。" },
      { s: "Listening is a {skill} that we can improve.", cn: "倾听是一项可以提升的技能。" },
      { s: "The more you practice, the {better} you become.", cn: "练得越多，你变得越好。" }
    ],
    quiz: [
      { q: "What does RASA mean?", opts: ["Receive, Appreciate, Summarize, Ask", "Read, Answer, Speak, Act", "Repeat, Analyze, Select, Apply", "Relax, Accept, Smile, Agree"], ans: 0, cn: "RASA = 接收、欣赏、总结、提问。" },
      { q: "How much of our communication time do we spend listening?", opts: ["30%", "45%", "60%", "80%"], ans: 2, cn: "约 60% 的沟通时间在听。" },
      { q: "What is the best listening aid according to Julian?", opts: ["Headphones", "Silence", "Coffee", "Music"], ans: 1, cn: "安静是绝佳的倾听辅助。" }
    ],
    speaking: {
      lines: [
        { en: "We spend a lot of time listening, but not very well.", cn: "我们花很多时间听，但听得并不好。" },
        { en: "Silence is the best listening aid.", cn: "安静是最好的倾听辅助。" }
      ],
      prompt: "用英语复述 RASA 四个步骤，并各配一个动作提示。"
    }
  },
  {
    day: 4, slug: "tim_urban_inside_the_mind_of_a_master_procrastinator",
    title: "拖延症大脑里住了只猴子", speaker: "Tim Urban", dur: "14:02", level: "六级",
    fun: "爆笑 · 拖延症必看",
    words: [
      { en: "procrastination", ph: "/prəˌkræstɪˈneɪʃn/", cn: "拖延", ex: "Procrastination is a big problem for me." },
      { en: "deadline", ph: "/ˈdedlaɪn/", cn: "截止日期", ex: "I work best near a deadline." },
      { en: "monkey", ph: "/ˈmʌŋki/", cn: "猴子", ex: "The Instant Gratification Monkey lives in my brain." },
      { en: "panic", ph: "/ˈpænɪk/", cn: "恐慌", ex: "The Panic Monster wakes me up." },
      { en: "instant", ph: "/ˈɪnstənt/", cn: "即时的", ex: "The monkey loves instant pleasure." },
      { en: "pleasure", ph: "/ˈpleʒər/", cn: "快乐；愉悦", ex: "Short-term pleasure beats long-term goals." }
    ],
    cloze: [
      { s: "In college, I wrote a 90-page {thesis}.", cn: "大学时我写了一篇 90 页的毕业论文。" },
      { s: "The Instant Gratification {Monkey} lives inside my brain.", cn: "即时满足猴子住在我大脑里。" },
      { s: "The monkey only cares about {fun}, and hates work.", cn: "猴子只在乎好玩，讨厌干活。" },
      { s: "The Panic Monster is the only thing the monkey is {afraid} of.", cn: "恐慌怪兽是猴子唯一害怕的东西。" },
      { s: "Without a deadline, the monkey stays in {control}.", cn: "没有截止日期时，猴子说了算。" },
      { s: "Short-term {pleasure} often wins over long-term goals.", cn: "短期快感常常赢过长期目标。" }
    ],
    quiz: [
      { q: "What does the Instant Gratification Monkey love?", opts: ["Work", "Fun", "Deadlines", "Homework"], ans: 1, cn: "猴子只爱即时快乐。" },
      { q: "What wakes the monkey up?", opts: ["The alarm clock", "The Panic Monster", "Coffee", "A phone call"], ans: 1, cn: "恐慌怪兽出现时，猴子才会让位。" },
      { q: "What is the main point of the talk?", opts: ["Monkeys are cute", "We should understand how procrastination works", "Deadlines are useless", "Hard work is bad"], ans: 1, cn: "核心：搞懂拖延的机制才能战胜它。" }
    ],
    speaking: {
      lines: [
        { en: "The monkey only cares about fun, not work.", cn: "猴子只在乎好玩，不在乎干活。" },
        { en: "The Panic Monster wakes up when a deadline comes.", cn: "截止日期一到，恐慌怪兽就醒了。" }
      ],
      prompt: "用英语说说：你拖延时大脑里发生了什么？"
    }
  },
  {
    day: 5, slug: "angela_lee_duckworth_grit_the_power_of_passion_and_perseverance",
    title: "比天赋更重要的是“坚毅”", speaker: "Angela Lee Duckworth", dur: "06:08", level: "四级~六级",
    fun: "打鸡血 · 坚持的力量",
    words: [
      { en: "grit", ph: "/ɡrɪt/", cn: "坚毅", ex: "Grit is passion and perseverance." },
      { en: "perseverance", ph: "/ˌpɜːrsəˈvɪrəns/", cn: "坚持不懈", ex: "Perseverance matters more than talent." },
      { en: "passion", ph: "/ˈpæʃn/", cn: "热情", ex: "Follow your passion for the long term." },
      { en: "talent", ph: "/ˈtælənt/", cn: "天赋", ex: "Talent is not the same as grit." },
      { en: "mindset", ph: "/ˈmaɪndset/", cn: "思维模式", ex: "A growth mindset helps us improve." },
      { en: "effort", ph: "/ˈefərt/", cn: "努力", ex: "Effort counts twice." }
    ],
    cloze: [
      { s: "Grit is passion and perseverance for very {long-term} goals.", cn: "坚毅是对长期目标的热情和坚持。" },
      { s: "Talent is not the same as {grit}.", cn: "天赋不等于坚毅。" },
      { s: "Gritty people keep working even when things get {hard}.", cn: "坚毅的人在困难时依然坚持。" },
      { s: "We can grow grit by developing a growth {mindset}.", cn: "培养成长型思维可以增强坚毅。" },
      { s: "Effort counts twice: it builds {skill} and makes skill valuable.", cn: "努力算两次：它塑造技能，也让技能更有价值。" },
      { s: "It's not about being smart; it's about showing {up} every day.", cn: "重要的不是聪明，而是每天坚持出现。" }
    ],
    quiz: [
      { q: "How does Angela define grit?", opts: ["Being talented", "Passion and perseverance for long-term goals", "Working fast", "Being popular"], ans: 1, cn: "坚毅 = 对长期目标的热情 + 坚持。" },
      { q: "What did she learn from teaching in Chicago?", opts: ["Grit predicts success better than IQ", "IQ is everything", "Kids don't need grit", "Talent always wins"], ans: 0, cn: "坚毅比 IQ 更能预测长期成功。" },
      { q: "How can we grow grit?", opts: ["By giving up", "By developing a growth mindset", "By being born lucky", "By avoiding challenges"], ans: 1, cn: "通过成长型思维培养坚毅。" }
    ],
    speaking: {
      lines: [
        { en: "Grit is passion and perseverance for long-term goals.", cn: "坚毅是对长期目标的热情与坚持。" },
        { en: "Effort counts twice.", cn: "努力算两次。" }
      ],
      prompt: "用英语介绍一个你坚持最久的事，并说明为什么能坚持。"
    }
  },
  {
    day: 6, slug: "josh_kaufman_the_first_20_hours_how_to_learn_anything",
    title: "20 小时快速入门任何技能", speaker: "Josh Kaufman", dur: "19:27", level: "四级~六级",
    fun: "学习方法 · 马上能用",
    words: [
      { en: "deliberate", ph: "/dɪˈlɪbərət/", cn: "刻意的", ex: "Focused, deliberate practice works best." },
      { en: "deconstruct", ph: "/ˌdiːkənˈstrʌkt/", cn: "拆解", ex: "Deconstruct the skill into small parts." },
      { en: "practice", ph: "/ˈpræktɪs/", cn: "练习", ex: "Practice for at least 20 hours." },
      { en: "barrier", ph: "/ˈbæriər/", cn: "障碍", ex: "Remove the barriers to practice." },
      { en: "feedback", ph: "/ˈfiːdbæk/", cn: "反馈", ex: "Learn enough to self-correct." },
      { en: "improve", ph: "/ɪmˈpruːv/", cn: "改进", ex: "You will improve quickly." }
    ],
    cloze: [
      { s: "You can learn any skill in about 20 {hours}.", cn: "任何技能都能在约 20 小时内入门。" },
      { s: "First, {deconstruct} the skill into small parts.", cn: "第一步：把技能拆解成小块。" },
      { s: "Learn enough to {self}-correct as you practice.", cn: "学到足以自我纠错的程度。" },
      { s: "Remove the {barriers} that stop you from practicing.", cn: "移除妨碍你练习的障碍。" },
      { s: "Pre-commit to at least 20 hours of {practice}.", cn: "承诺至少练习 20 小时。" },
      { s: "Focused, deliberate practice works {faster} than passive watching.", cn: "专注的刻意练习比被动观看更快。" }
    ],
    quiz: [
      { q: "How many hours does Josh say are enough to learn a skill?", opts: ["10", "20", "100", "1000"], ans: 1, cn: "约 20 小时即可入门。" },
      { q: "What is the first step?", opts: ["Buy equipment", "Deconstruct the skill", "Watch videos", "Find a teacher"], ans: 1, cn: "第一步是拆解技能。" },
      { q: "Why remove barriers to practice?", opts: ["To save money", "So you can practice more easily", "To avoid mistakes", "To look cool"], ans: 1, cn: "减少障碍，练习更容易开始。" }
    ],
    speaking: {
      lines: [
        { en: "Break the skill into small parts.", cn: "把技能拆成小块。" },
        { en: "Twenty hours of focused practice is enough to get started.", cn: "20 小时的专注练习足以让你入门。" }
      ],
      prompt: "用英语说出一项你想学的技能，以及你拆解它的第一步。"
    }
  },
  {
    day: 7, slug: "kelly_mcgonigal_how_to_make_stress_your_friend",
    title: "把压力变成朋友", speaker: "Kelly McGonigal", dur: "13:59", level: "六级",
    fun: "心态转变 · 考试/发布压力都适用",
    words: [
      { en: "stress", ph: "/stres/", cn: "压力", ex: "Stress is a natural response." },
      { en: "response", ph: "/rɪˈspɑːns/", cn: "反应", ex: "Your body's stress response protects you." },
      { en: "meaning", ph: "/ˈmiːnɪŋ/", cn: "意义", ex: "Chasing meaning is good for your health." },
      { en: "social", ph: "/ˈsoʊʃl/", cn: "社交的", ex: "Stress makes you social." },
      { en: "mindset", ph: "/ˈmaɪndset/", cn: "心态", ex: "Your mindset changes your response." },
      { en: "protect", ph: "/prəˈtekt/", cn: "保护", ex: "The stress response is designed to protect you." }
    ],
    cloze: [
      { s: "I used to tell people that stress makes you {sick}.", cn: "我曾告诉大家压力会让人生病。" },
      { s: "Chasing meaning is better for your health than avoiding {discomfort}.", cn: "追求意义比逃避不适更有益健康。" },
      { s: "Stress makes you {social}: it releases oxytocin.", cn: "压力让你更想社交：它会释放催产素。" },
      { s: "Your stress response is designed to {protect} you.", cn: "你的压力反应本是为了保护你。" },
      { s: "How you think about stress {matters}.", cn: "你怎么看待压力，结果大不相同。" },
      { s: "When you see stress as a {challenge}, your body responds differently.", cn: "把压力视为挑战，身体反应会不同。" }
    ],
    quiz: [
      { q: "What does oxytocin do during stress?", opts: ["Makes you sleepy", "Makes you social and caring", "Makes you hungry", "Makes you forget"], ans: 1, cn: "催产素让人更愿意社交、更关心他人。" },
      { q: "What is better for your health?", opts: ["Avoiding all stress", "Chasing meaning", "Staying alone", "Complaining"], ans: 1, cn: "追求意义比逃避压力更健康。" },
      { q: "What changes how stress affects you?", opts: ["Your age", "Your mindset", "Your salary", "The weather"], ans: 1, cn: "看待压力的心态会改变影响。" }
    ],
    speaking: {
      lines: [
        { en: "Stress makes you social.", cn: "压力会让你更愿意社交。" },
        { en: "Chasing meaning is good for your health.", cn: "追求意义有益健康。" }
      ],
      prompt: "用英语说说：你面对六级考试/重要发布时的压力，打算怎么“交朋友”？"
    }
  },
  {
    day: 8, slug: "shawn_achor_the_happy_secret_to_better_work",
    title: "快乐的秘密：先开心，再高效", speaker: "Shawn Achor", dur: "12:21", level: "四级~六级",
    fun: "积极心理学 · 提升效率",
    words: [
      { en: "happiness", ph: "/ˈhæpinəs/", cn: "幸福", ex: "Happiness is the precursor to success." },
      { en: "advantage", ph: "/ədˈvæntɪdʒ/", cn: "优势", ex: "This is the happiness advantage." },
      { en: "gratitude", ph: "/ˈɡrætɪtuːd/", cn: "感恩", ex: "Keep a gratitude journal." },
      { en: "positive", ph: "/ˈpɑːzətɪv/", cn: "积极的", ex: "A positive brain works better." },
      { en: "performance", ph: "/pərˈfɔːrməns/", cn: "表现", ex: "Happiness improves performance." },
      { en: "retrain", ph: "/ˌriːˈtreɪn/", cn: "重新训练", ex: "We can retrain our brains." }
    ],
    cloze: [
      { s: "Happiness is the {precursor} to success, not the result.", cn: "快乐是成功的前兆，而不是结果。" },
      { s: "Your brain works better when it is {positive}.", cn: "大脑在积极状态时表现更好。" },
      { s: "Write down three things you're {grateful} for every day.", cn: "每天写下三件感恩的事。" },
      { s: "This is called the happiness {advantage}.", cn: "这被称为“快乐优势”。" },
      { s: "We can {retrain} our brains to be more optimistic.", cn: "我们可以重新训练大脑变得更乐观。" },
      { s: "A positive brain performs significantly {better}.", cn: "积极的大脑表现明显更好。" }
    ],
    quiz: [
      { q: "What is Shawn's main claim?", opts: ["Success leads to happiness", "Happiness leads to success", "Money is everything", "Work comes first"], ans: 1, cn: "快乐是成功的先导。" },
      { q: "What gratitude exercise does he suggest?", opts: ["Write 3 things you're grateful for daily", "Count your money", "Exercise at noon", "Sleep more"], ans: 0, cn: "每天写下三件感恩的事。" },
      { q: "How does a positive brain perform?", opts: ["Worse", "The same", "Significantly better", "It depends"], ans: 2, cn: "积极大脑表现明显更好。" }
    ],
    speaking: {
      lines: [
        { en: "Happiness is the precursor to success.", cn: "快乐是成功的前兆。" },
        { en: "Write down three things you are grateful for.", cn: "写下三件你感恩的事。" }
      ],
      prompt: "用英语说出今天让你感恩的三件事。"
    }
  },
  {
    day: 9, slug: "ken_robinson_says_schools_kill_creativity",
    title: "学校扼杀创造力吗？", speaker: "Sir Ken Robinson", dur: "19:24", level: "六级",
    fun: "TED 经典 · 大胆表达",
    words: [
      { en: "creativity", ph: "/ˌkriːeɪˈtɪvəti/", cn: "创造力", ex: "Creativity is as important as literacy." },
      { en: "literacy", ph: "/ˈlɪtərəsi/", cn: "读写能力", ex: "We treat literacy with respect." },
      { en: "mistake", ph: "/mɪˈsteɪk/", cn: "错误", ex: "Kids take chances and make mistakes." },
      { en: "original", ph: "/əˈrɪdʒənl/", cn: "原创的", ex: "Come up with original ideas." },
      { en: "risk", ph: "/rɪsk/", cn: "冒险", ex: "Be prepared to take a risk." },
      { en: "education", ph: "/ˌedʒuˈkeɪʃn/", cn: "教育", ex: "Education should nurture creativity." }
    ],
    cloze: [
      { s: "Creativity is as important as {literacy}.", cn: "创造力与读写能力同等重要。" },
      { s: "Kids will take a {chance}: if they don't know, they'll have a go.", cn: "孩子会冒险：不知道就试试。" },
      { s: "If you're not prepared to be wrong, you'll never come up with anything {original}.", cn: "如果你不允许犯错，就不会有原创。" },
      { s: "We don't grow into creativity; we grow {out} of it.", cn: "我们不是长出了创造力，而是失去了它。" },
      { s: "Creativity is not just about the arts; it's about {ideas}.", cn: "创造力不只关乎艺术，也关乎想法。" },
      { s: "Many people are afraid of being {wrong}.", cn: "很多人害怕犯错。" }
    ],
    quiz: [
      { q: "What does Ken Robinson say about creativity?", opts: ["It's less important than math", "It's as important as literacy", "Only artists need it", "It can't be taught"], ans: 1, cn: "创造力与读写能力同等重要。" },
      { q: "What do children do that adults often stop doing?", opts: ["Take chances and make mistakes", "Sleep a lot", "Watch TV", "Avoid fun"], ans: 0, cn: "孩子敢于尝试和犯错。" },
      { q: "What is the talk's main argument?", opts: ["Schools help creativity", "Schools can kill creativity", "Creativity is genetic", "Art classes are useless"], ans: 1, cn: "学校常常扼杀创造力。" }
    ],
    speaking: {
      lines: [
        { en: "Creativity is as important as literacy.", cn: "创造力与读写能力同等重要。" },
        { en: "If you're not prepared to be wrong, you'll never create anything original.", cn: "不敢犯错，就不会有原创。" }
      ],
      prompt: "用英语谈谈：你最近做过最有创造力的一件事是什么？"
    }
  },
  {
    day: 10, slug: "robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
    title: "什么让人生幸福？75 年研究结论", speaker: "Robert Waldinger", dur: "12:47", level: "六级",
    fun: "哈佛研究 · 人生话题",
    words: [
      { en: "relationship", ph: "/rɪˈleɪʃnʃɪp/", cn: "人际关系", ex: "Good relationships keep us happy." },
      { en: "loneliness", ph: "/ˈloʊnlinəs/", cn: "孤独", ex: "Loneliness kills." },
      { en: "quality", ph: "/ˈkwɑːləti/", cn: "质量", ex: "Quality matters more than quantity." },
      { en: "health", ph: "/helθ/", cn: "健康", ex: "Relationships protect our health." },
      { en: "connect", ph: "/kəˈnekt/", cn: "联系", ex: "We need to connect with others." },
      { en: "maintain", ph: "/meɪnˈteɪn/", cn: "维持", ex: "Relationships require effort to maintain." }
    ],
    cloze: [
      { s: "Good relationships keep us {happier} and healthier.", cn: "良好的人际关系让我们更快乐、更健康。" },
      { s: "Loneliness {kills}: it is as harmful as smoking.", cn: "孤独会致命：其危害不亚于吸烟。" },
      { s: "It's the {quality} of relationships that matters, not the number.", cn: "重要的是关系质量，不是数量。" },
      { s: "People who are more socially connected are {healthier}.", cn: "社交联系更紧密的人更健康。" },
      { s: "Relationships require {effort} to maintain.", cn: "关系需要用心经营。" },
      { s: "Taking care of your relationships is taking care of your {health}.", cn: "经营关系就是经营健康。" }
    ],
    quiz: [
      { q: "What did the 75-year study find?", opts: ["Money brings happiness", "Good relationships keep us happy and healthy", "Fame is the key", "Genes decide everything"], ans: 1, cn: "良好关系让人更快乐健康。" },
      { q: "How harmful is loneliness?", opts: ["Not harmful", "As harmful as smoking", "Only for old people", "Only in winter"], ans: 1, cn: "孤独危害堪比吸烟。" },
      { q: "What matters more, according to the study?", opts: ["Number of friends", "Quality of relationships", "Social media followers", "How rich you are"], ans: 1, cn: "关系质量比数量重要。" }
    ],
    speaking: {
      lines: [
        { en: "Good relationships keep us happier and healthier.", cn: "良好关系让我们更快乐、更健康。" },
        { en: "Loneliness is as harmful as smoking.", cn: "孤独的危害不亚于吸烟。" }
      ],
      prompt: "用英语介绍一个对你很重要的朋友，以及你们如何保持联系。"
    }
  },
  {
    day: 11, slug: "sheena_iyengar_the_art_of_choosing",
    title: "选择太多反而痛苦", speaker: "Sheena Iyengar", dur: "24:06", level: "六级+",
    fun: "认知升级 · 选择心理学",
    words: [
      { en: "choice", ph: "/tʃɔɪs/", cn: "选择", ex: "We face more choices than ever." },
      { en: "overload", ph: "/ˌoʊvərˈloʊd/", cn: "超载", ex: "Choice overload leads to paralysis." },
      { en: "paralysis", ph: "/pəˈræləsɪs/", cn: "瘫痪；无法决定", ex: "Too many options cause paralysis." },
      { en: "freedom", ph: "/ˈfriːdəm/", cn: "自由", ex: "Choice is a form of freedom." },
      { en: "culture", ph: "/ˈkʌltʃər/", cn: "文化", ex: "Culture shapes how we choose." },
      { en: "decide", ph: "/dɪˈsaɪd/", cn: "决定", ex: "Fewer options make it easier to decide." }
    ],
    cloze: [
      { s: "Every day we face more {choices} than ever before.", cn: "我们每天面对的选择比以往任何时候都多。" },
      { s: "Too many options can lead to {paralysis}.", cn: "选项太多会导致无法决定。" },
      { s: "Choice is a form of {freedom}.", cn: "选择是自由的一种形式。" },
      { s: "But too much choice can make us {unhappy}.", cn: "但选择太多反而让我们不快乐。" },
      { s: "Culture shapes how we {choose}.", cn: "文化塑造我们如何选择。" },
      { s: "Sometimes fewer options make it easier to {decide}.", cn: "有时选项越少越容易做决定。" }
    ],
    quiz: [
      { q: "What happens when there are too many options?", opts: ["We decide faster", "We may feel paralyzed", "We always choose well", "We feel happier"], ans: 1, cn: "选择过多会导致决策瘫痪。" },
      { q: "What does choice represent?", opts: ["A burden", "Freedom", "A mistake", "A trend"], ans: 1, cn: "选择代表自由。" },
      { q: "What shapes how we choose?", opts: ["Only price", "Culture", "Weather", "Luck"], ans: 1, cn: "文化影响我们的选择方式。" }
    ],
    speaking: {
      lines: [
        { en: "Too many options can lead to paralysis.", cn: "选项太多会导致无法决定。" },
        { en: "Fewer options can make it easier to decide.", cn: "选项少更容易做决定。" }
      ],
      prompt: "用英语说说：你买手机/选课/定旅行计划时，选项太多会怎么办？"
    }
  },
  {
    day: 12, slug: "julian_treasure_how_to_speak_so_that_people_want_to_listen",
    title: "这样说话，别人愿意听", speaker: "Julian Treasure", dur: "09:58", level: "四级~六级",
    fun: "表达利器 · 口语气场",
    words: [
      { en: "gossip", ph: "/ˈɡɑːsɪp/", cn: "八卦", ex: "Gossip is one of the seven deadly sins of speaking." },
      { en: "negativity", ph: "/ˌneɡəˈtɪvəti/", cn: "消极", ex: "Avoid negativity when you speak." },
      { en: "honesty", ph: "/ˈɑːnəsti/", cn: "诚实", ex: "Honesty is the H in HAIL." },
      { en: "authenticity", ph: "/ˌɔːθenˈtɪsəti/", cn: "真实", ex: "Be yourself: authenticity matters." },
      { en: "integrity", ph: "/ɪnˈteɡrəti/", cn: "正直", ex: "Say what you mean, with integrity." },
      { en: "powerful", ph: "/ˈpaʊərfl/", cn: "有力量的", ex: "Your voice is powerful." }
    ],
    cloze: [
      { s: "The seven deadly sins of speaking include gossip, judging and {negativity}.", cn: "说话的七宗罪包括八卦、评判和消极。" },
      { s: "HAIL stands for Honesty, Authenticity, Integrity and {Love}.", cn: "HAIL 代表诚实、真实、正直和爱。" },
      { s: "Honesty means being {true} to your word.", cn: "诚实意味着言行一致。" },
      { s: "Speaking powerfully means speaking with {empathy}.", cn: "有力量的表达要带着同理心。" },
      { s: "Your voice is the most {powerful} sound in the world.", cn: "你的声音是世上最有力量的声音。" },
      { s: "We can change the world by {speaking} and listening better.", cn: "更好的说与听，能改变世界。" }
    ],
    quiz: [
      { q: "What does HAIL stand for?", opts: ["Honesty, Authenticity, Integrity, Love", "Happiness, Action, Ideas, Laugh", "Help, Ask, Inspire, Lead", "Hope, Art, Intention, Light"], ans: 0, cn: "HAIL = 诚实、真实、正直、爱。" },
      { q: "Which is one of the seven deadly sins of speaking?", opts: ["Smiling", "Gossip", "Listening", "Pausing"], ans: 1, cn: "八卦是说话七宗罪之一。" },
      { q: "What is the main message?", opts: ["Speak louder", "Use big words", "Speak with honesty and empathy", "Talk faster"], ans: 2, cn: "核心：真诚且有同理心地表达。" }
    ],
    speaking: {
      lines: [
        { en: "Your voice is the most powerful sound in the world.", cn: "你的声音是世上最有力量的声音。" },
        { en: "Speak with honesty, authenticity, integrity and love.", cn: "带着诚实、真实、正直和爱去表达。" }
      ],
      prompt: "用英语介绍你自己 30 秒，注意用上 HAIL 的原则。"
    }
  }
];

/* ---------- 记账 ---------- */
const LEDGER_CATS = {
  支出: ["餐饮", "交通", "购物", "娱乐", "学习", "医疗", "人情", "居住", "其他"],
  收入: ["工资", "兼职", "理财", "红包", "其他"]
};

/* ---------- 自媒体 ---------- */
const MEDIA_PLATFORMS = ["抖音", "小红书", "视频号", "B站", "YouTube", "其他"];
const MEDIA_STATUS = ["草稿", "剪辑中", "待发布", "已发布"];

/* B站固定推荐视频（静态托管时无需接口即可显示标题） */
const BILI_PINNED_META = {
  "BV19w411i7iE": {
    title: "【听力磨耳朵】高效练习英语听力600句 | 四六级雅思托福练习必备！",
    author: "李圆圆Emma",
    dur: "05:25:29"
  },
  "BV1ij411s7Fm": {
    title: "【Day43】每日英语听力保姆级：盲听+英文+中英+跟读+盲听，反复听！",
    author: "YouTube官方学习",
    dur: "03:11"
  }
};
