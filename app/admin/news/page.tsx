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

interface NewsClipping {
  id: string
  image: string
  title: string
  order_index: number
  is_active: boolean
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsClipping[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<NewsClipping>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({
    image: "",
    title: "",
    is_active: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from("kmong_12_news_clippings")
      .select("*")
      .order("order_index")
    
    if (data && !error) {
      setNews(data)
    }
    setLoading(false)
  }

  const handleEdit = (item: NewsClipping) => {
    setEditingId(item.id)
    setEditForm({
      image: item.image,
      title: item.title,
      is_active: item.is_active
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    const { error } = await supabase
      .from("kmong_12_news_clippings")
      .update({
        image: editForm.image,
        title: editForm.title,
        is_active: editForm.is_active,
        updated_at: new Date().toISOString()
      })
      .eq("id", editingId)

    if (!error) {
      await fetchNews()
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("kmong_12_news_clippings")
        .delete()
        .eq("id", id)

      if (!error) {
        await fetchNews()
      }
    }
  }

  const handleAdd = async () => {
    const { error } = await supabase
      .from("kmong_12_news_clippings")
      .insert({
        image: newForm.image,
        title: newForm.title,
        order_index: news.length,
        is_active: newForm.is_active
      })

    if (!error) {
      await fetchNews()
      setIsAdding(false)
      setNewForm({ image: "", title: "", is_active: true })
    }
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = news.findIndex(n => n.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === news.length - 1)) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newNews = [...news]
    const temp = newNews[index]
    newNews[index] = newNews[newIndex]
    newNews[newIndex] = temp

    await Promise.all([
      supabase.from("kmong_12_news_clippings").update({ order_index: index }).eq("id", newNews[index].id),
      supabase.from("kmong_12_news_clippings").update({ order_index: newIndex }).eq("id", newNews[newIndex].id)
    ])

    await fetchNews()
  }

  const handleToggleActive = async (id: string, is_active: boolean) => {
    await supabase
      .from("kmong_12_news_clippings")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
    
    await fetchNews()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">뉴스클리핑 관리</h1>
          <p className="text-gray-600 mt-2">언론 보도 이미지를 관리합니다</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            새 뉴스 추가
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
                <CardTitle>새 뉴스클리핑 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>이미지 URL</Label>
                  <Input 
                    placeholder="/news-image.jpg"
                    value={newForm.image}
                    onChange={(e) => setNewForm({ ...newForm, image: e.target.value })}
                  />
                </div>
                <div>
                  <Label>제목 (선택)</Label>
                  <Input 
                    placeholder="뉴스 제목"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
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

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, index) => (
          <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
            {editingId === item.id ? (
              <CardContent className="p-4 space-y-3">
                <Input 
                  placeholder="이미지 URL"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                />
                <Input 
                  placeholder="제목 (선택)"
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={editForm.is_active}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                  />
                  <Label className="text-sm">활성화</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    저장
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <div className="aspect-video relative">
                  <img src={item.image} alt={item.title || "뉴스 이미지"} className="w-full h-full object-cover rounded-t-lg" />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    순서: {index + 1}
                  </div>
                </div>
                <CardContent className="p-4">
                  {item.title && <h3 className="font-medium text-sm">{item.title}</h3>}
                  <div className="flex justify-between items-center mt-3">
                    <Switch 
                      checked={item.is_active}
                      onCheckedChange={(checked) => handleToggleActive(item.id, checked)}
                    />
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleMove(item.id, "up")} disabled={index === 0}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleMove(item.id, "down")} disabled={index === news.length - 1}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}