export default {
  ja: {
    Title: {
      title: '人狼プレーン',
    },
    Header: {
      roomList: '村一覧',
      about: 'このサイトについて',
      rules: 'ルール説明',
      profile: 'プロフィール',
      settings: '設定',
      login: 'ログイン',
      logout: 'ログアウト',
    },
    HeaderGame: {
      start: 'ゲーム開始',
    },
    DialogAccessCode: {
      title: 'アクセスコード',
      invalidAccessCode: 'アクセスコードが正しくありません',
      close: '閉じる',
    },
    DialogRoomCreate: {
      hostGame: '村を作成',
      villageName: '村名',
      required: '必須',
      onlyWhitespace: '空白文字のみ',
      tooLong: '長すぎます',
      description: '説明（任意）',
      capacity: '人数',
      dayLength: '昼時間 (分)',
      nightLength: '夜時間 (分)',
      private: '身内村',
      accessCode: 'アクセスコード',
      whitespaceIsNotAllowed: '空白文字は使えません',
      invalidLength: 'アクセスコードは4文字以上20文字以下です',
      ok: '作成',
      cancel: 'キャンセル',
    },
    DialogRoomLeave: {
      leave: '村を去る',
      title: '村を去る',
      para1: '本当に村を去りますか？',
      cancel: 'キャンセル',
    },
    DialogPlayerKickOut: {
      title: 'プレーヤーを蹴る',
      para1: '本当にこのプレーヤーを蹴りますか？',
      cancel: 'キャンセル',
    },
    DialogRoomDetails: {
      details: '詳細',
      daytime: '昼時間',
      night: '夜時間',
      minutes: '分',
      capacity: '人数',
      fivePlayerVillage: '村人3、占い師1、人狼1',
      ninePlayerVillage: '村人4、占い師1、騎士1、人狼2、狂人1',
      elevenPlayerVillage: '村人5、占い師1、霊能者1、騎士1、人狼2、狂人1',
      fifteenPlayerVillage: '村人8、占い師1、霊能者1、騎士1、人狼3、狂人1',
      close: '閉じる',
    },
    DialogRole: {
      villager: 'あなたは村人です',
      villagerDescription: '普通の村人です。何の能力も持ちません。',
      seer: 'あなたは占い師です',
      seerDescription: '毎日1人選んでそのプレーヤーが人狼かどうか確認できます。',
      medium: 'あなたは霊能者です',
      mediumDescription: '前日に処刑されたプレーヤーが人狼かどうか確認できます。',
      knight: 'あなたは騎士です',
      knightDescription: '毎日1人選んでそのプレーヤーを人狼から護衛できます。選択されたプレーヤーはその日人狼に噛まれません。',
      werewolf: 'あなたは人狼です',
      werewolfDescription: '各人狼はプレーヤーを1人選択し最も選ばれたプレーヤーをその夜に噛みます。人狼は夜でも会話することができます。誰も選択されなかった場合はランダムで噛まれるプレーヤーが決定されます。',
      minion: 'あなたは狂人です',
      minionDescription: '狂人は人狼陣営ですが、占い師や霊能者からは人間として見られます。人狼が勝利すれば狂人も勝利します。狂人は何の能力も持たず誰が人狼なのかも知ることはできません。',
      close: '閉じる',
    },
    DialogSettings: {
      title: '設定',
      gameName: 'ゲーム内で使用する名前',
      tooLong: '長すぎます',
      avatar: 'アバター',
      avatarErrorMessage: '画像サイズが2MBを超えています',
      uploadAvatar: '画像をアップロード',
      preview: 'プレビュー',
      close: '閉じる',
      save: '保存',
      cancel: 'キャンセル',
    },
    About: {
      about: {
        title: 'このサイトについて',
        para1: '人狼プレーンはシンプルで使いやすい人狼ゲームサーバーです。',
      },
      settingUp: {
        title: '遊び方',
        para1: '1. ”村を作成” ボタンを押して村を建てる事ができます。',
        para2: '2. 人数が揃ったら”ゲーム開始” ボタンを押してゲームを開始できます。',
        para3: '村長はゲーム開始前なら他のプレーヤーを蹴る事ができます。プレーヤーはゲーム開始前なら村を去ることができます。村長が村を去ると村は消滅します。',
      },
      villageAndRoles: {
        title: '村の種類と役職',
        para1: '5人村',
        para2: '村人3、占い師1、人狼1',
        para3: '9人村',
        para4: '村人4、占い師1、騎士1、人狼2、狂人1',
        para5: '11人村',
        para6: '村人5、占い師1、霊能者1、騎士1、人狼2、狂人1',
        para7: '15人村',
        para8: '村人8、占い師1、霊能者1、騎士1、人狼3、狂人1',
      },
      supportThisSite: {
        title: 'サイトを応援する',
        para1: 'サーバーの人口が多くなればより楽しくなると思うのでサイトの知名度向上のためSNS等でシェアお願いします!',
      },
      feedback: {
        title: 'フィードバック',
        para1: 'Discord、またはメールでフィードバック、質問、バグ報告等受け付けています。',
        email: 'メールアドレス',
      },
      credit: {
        title: 'クレジット',
        logo: 'ロゴ: ',
      },
    },
    Rules: {
      title: 'ルール説明',
      howToWin: {
        title: '基本ルール',
        para1: '村はすべての人狼を処刑すれば勝利です。人狼は村人を噛んでいき、人狼の数が村人の数以上になれば勝利です。',
        para2: '村人は毎日投票を行い人狼を処刑することが目的です。人狼は毎晩村人を1人噛んでいき村人陣営を減らしていきます。',
      },
      gameFlow: {
        title: 'ゲームの流れ',
        para1: '人狼ゲームは昼と夜のターンがありゲームが終了するまで昼→夜→昼..と繰り返していきます。昼はプレーヤーは議論して人狼だと思われるプレーヤーを投票します。夜は村人は発言を禁止されますが、人狼は狼チャットを使って話す事ができます。次の昼が来る時に、最も投票されたプレーヤーが処刑され、狼に最も選ばれたプレーヤーが噛まれます。死んだプレーヤーが打ったメッセージは生きているプレーヤーには見えません。人狼の数が村人の数以上になるか、人狼の数が0になればゲーム終了です。',
      },
      roles: {
        title: '役職',
        para1: '役職はゲーム開始時にランダムに決定されます。',
        villager: '村人',
        para2: '何の能力も持たない村人です。',
        seer: '占い師',
        para3: '毎日1人選んでそのプレーヤーが人狼かそうでないか確認することができます。結果は次の日の昼が来る時に通知されます。',
        medium: '霊能者',
        para4: '霊能者は前日に処刑されたプレーヤーが人狼かそうでないか確認できます。',
        knight: '騎士',
        para5: '毎日1人選んでそのプレーヤーを人狼から護衛できます。選択されたプレーヤーはその日人狼に噛まれません。同じプレーヤーを連続で護衛することも可能です。',
        werewolf: '人狼',
        para6: '各人狼はプレーヤーを1人選択し最も選ばれたプレーヤーをその夜に噛みます。人狼は夜でも会話することができます。誰も選択されなかった場合はランダムで噛まれるプレーヤーが決定されます。',
        minion: '狂人',
        para7: '狂人は人狼陣営ですが、占い師や霊能者からは人間として見られます。人狼が勝利すれば狂人も勝利します。狂人は何の能力も持たず誰が人狼なのかも知ることはできません。',
      },
      others: {
        title: 'その他',
        voting: '投票',
        para1: 'すべてのプレーヤーは次の日の昼が来るまでに投票を行う必要があります。投票をしなかったプレーヤーは突然死します。投票先はその日の間にいつでも変更できます。複数のプレーヤーが同票だった場合そのプレーヤーの中でランダムに処刑されます。次の日の昼が来る時にまず処刑が行われ、人狼が生きていれば村人が噛まれます。人狼が処刑されたプレーヤーを選択した場合、誰も噛まれません。全員が投票せず突然死した場合、村が勝利する仕様になっています。',
        message: 'メッセージ',
        para2: '最大文字数は500文字です。',
      }
    },
    RoomList: {
      new: '募集中',
      ongoing: '進行中',
      closed: '終了済',
      name: '村名',
      participants: '参加者数',
      enter: '入村',
    },
    Game: {
      all: '全体チャット',
      werewolfChat: '人狼チャット',
      resultsSeer: '占い結果',
      resultsMedium: '霊能結果',
      required: '必須',
      onlyWhitespace: '空白文字のみ',
      tooLong: '長すぎます',
    },
    Profile: {
      username: 'ユーザーネーム',
      usernameIsNotEditable: 'ユーザーネームは30日に1回変更できます',
      bio: '自己紹介',
      tooLong: '長すぎます',
      win: '勝',
      lose: '負',
      winRate: '勝率',
      role: '役職',
      villager: '村人',
      werewolf: '人狼',
      seer: '占い師',
      medium: '霊能者',
      knight: '騎士',
      minion: '狂人',
      save: '保存',
      cancel: 'キャンセル',
    },
  }
}
