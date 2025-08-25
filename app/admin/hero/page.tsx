"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

interface HeroContent {
  id: string
  image: string
  title: string
  badges: { text: string; className: string }[]
  order_index: number
  is_active: boolean
}

export default function HeroManagementPage() {
  const [contents, setContents] = useState<HeroContent[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<HeroContent>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({
    image: "",
    title: "",
    badges: "",
    is_active: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("kmong_12_hero_contents")
      .select("*")
      .order("order_index")
    
    if (data && !error) {
      setContents(data)
    }
    setLoading(false)
  }

  const handleEdit = (content: HeroContent) => {
    setEditingId(content.id)
    setEditForm({
      image: content.image,
      title: content.title,
      badges: content.badges,
      is_active: content.is_active
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    const { error } = await supabase
      .from("kmong_12_hero_contents")
      .update({
        image: editForm.image,
        title: editForm.title,
        badges: editForm.badges,
        is_active: editForm.is_active,
        updated_at: new Date().toISOString()
      })
      .eq("id", editingId)

    if (!error) {
      await fetchContents()
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("kmong_12_hero_contents")
        .delete()
        .eq("id", id)

      if (!error) {
        await fetchContents()
      }
    }
  }

  const handleAdd = async () => {
    const badges = newForm.badges.split(",").map(text => ({
      text: text.trim(),
      className: "badge-purple"
    })).filter(badge => badge.text)

    const { error } = await supabase
      .from("kmong_12_hero_contents")
      .insert({
        image: newForm.image,
        title: newForm.title,
        badges,
        order_index: contents.length,
        is_active: newForm.is_active
      })

    if (!error) {
      await fetchContents()
      setIsAdding(false)
      setNewForm({ image: "", title: "", badges: "", is_active: true })
    }
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = contents.findIndex(c => c.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === contents.length - 1)) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newContents = [...contents]
    const temp = newContents[index]
    newContents[index] = newContents[newIndex]
    newContents[newIndex] = temp

    // Update order_index for both items
    await Promise.all([
      supabase.from("kmong_12_hero_contents").update({ order_index: index }).eq("id", newContents[index].id),
      supabase.from("kmong_12_hero_contents").update({ order_index: newIndex }).eq("id", newContents[newIndex].id)
    ])

    await fetchContents()
  }

  const handleToggleActive = async (id: string, is_active: boolean) => {
    await supabase
      .from("kmong_12_hero_contents")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
    
    await fetchContents()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">메인 캐러셀 관리</h1>
          <p className="text-gray-600 mt-2">홈페이지 상단 캐러셀 콘텐츠를 관리합니다</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            새 콘텐츠 추가
          </Button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle>새 캐러셀 콘텐츠 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>이미지 URL</Label>
                  <Input 
                    placeholder="/youtube-content-1.png"
                    value={newForm.image}
                    onChange={(e) => setNewForm({ ...newForm, image: e.target.value })}
                  />
                </div>
                <div>
                  <Label>제목</Label>
                  <Input 
                    placeholder="콘텐츠 제목을 입력하세요"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>뱃지 (쉼표로 구분)</Label>
                  <Input 
                    placeholder="SNS, 바이럴, 콘텐츠"
                    value={newForm.badges}
                    onChange={(e) => setNewForm({ ...newForm, badges: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newForm.is_active}
                    onCheckedChange={(checked) => setNewForm({ ...newForm, is_active: checked })}
                  />
                  <Label>활성화</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content List */}
      <div className="space-y-4">
        {contents.map((content, index) => (
          <Card key={content.id} className={!content.is_active ? "opacity-60" : ""}>
            <CardContent className="p-6">
              {editingId === content.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>이미지 URL</Label>
                    <Input 
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>제목</Label>
                    <Input 
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>뱃지 (JSON 형식)</Label>
                    <Input 
                      value={JSON.stringify(editForm.badges)}
                      onChange={(e) => {
                        try {
                          setEditForm({ ...editForm, badges: JSON.parse(e.target.value) })
                        } catch {}
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={editForm.is_active}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                    />
                    <Label>활성화</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={content.image} alt={content.title} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{content.title}</h3>
                      <div className="flex gap-2 mt-2">
                        {content.badges.map((badge, i) => (
                          <span key={i} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                            {badge.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={content.is_active}
                      onCheckedChange={(checked) => handleToggleActive(content.id, checked)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleMove(content.id, "up")} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleMove(content.id, "down")} disabled={index === contents.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(content)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(content.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}